# Module 5 - États Parallèles

## Le problème

Certains systèmes ont des aspects **indépendants** qui évoluent en parallèle.

Exemple : un lecteur vidéo a :
- État de lecture : `playing` / `paused`
- État du volume : `muted` / `unmuted`
- État du mode : `normal` / `fullscreen`

Ces trois aspects sont **orthogonaux** : changer le volume n'affecte pas la lecture.

## Sans états parallèles (explosion combinatoire)

```typescript
// ❌ Explosion : 2 × 2 × 2 = 8 états !
states: {
  'playing.unmuted.normal': {},
  'playing.unmuted.fullscreen': {},
  'playing.muted.normal': {},
  'playing.muted.fullscreen': {},
  'paused.unmuted.normal': {},
  'paused.unmuted.fullscreen': {},
  'paused.muted.normal': {},
  'paused.muted.fullscreen': {},
}
```

## Avec états parallèles

```typescript
// ✅ Composition : 2 + 2 + 2 = 6 états
const videoPlayerMachine = createMachine({
  id: 'videoPlayer',
  type: 'parallel',  // ← La clé !
  states: {
    playback: {
      initial: 'paused',
      states: {
        playing: { on: { PAUSE: 'paused' } },
        paused: { on: { PLAY: 'playing' } }
      }
    },
    volume: {
      initial: 'unmuted',
      states: {
        muted: { on: { UNMUTE: 'unmuted' } },
        unmuted: { on: { MUTE: 'muted' } }
      }
    },
    display: {
      initial: 'normal',
      states: {
        normal: { on: { FULLSCREEN: 'fullscreen' } },
        fullscreen: { on: { EXIT_FULLSCREEN: 'normal' } }
      }
    }
  }
});
```

## L'état résultant

```typescript
actor.getSnapshot().value;
// Retourne :
// {
//   playback: 'paused',
//   volume: 'unmuted',
//   display: 'normal'
// }
```

Tous les "régions" parallèles sont actives simultanément.

## Tester l'état

```typescript
const snapshot = actor.getSnapshot();

// Tester une région spécifique
snapshot.matches({ playback: 'playing' });  // true/false

// Tester plusieurs régions
snapshot.matches({
  playback: 'playing',
  volume: 'muted'
});
```

## Événements partagés

Un même événement peut affecter plusieurs régions :

```typescript
type: 'parallel',
states: {
  playback: {
    initial: 'paused',
    states: {
      playing: {
        on: {
          PAUSE: 'paused',
          RESET: 'paused'  // ← RESET affecte cette région
        }
      },
      paused: { on: { PLAY: 'playing' } }
    }
  },
  volume: {
    initial: 'unmuted',
    states: {
      muted: { on: { UNMUTE: 'unmuted' } },
      unmuted: {
        on: {
          MUTE: 'muted',
          RESET: 'unmuted'  // ← RESET affecte aussi celle-ci
        }
      }
    }
  }
}
```

## Quand utiliser des états parallèles ?

| Utiliser | Ne pas utiliser |
|----------|-----------------|
| Aspects vraiment indépendants | États qui s'influencent mutuellement |
| Réduire l'explosion combinatoire | Quand la simplicité suffit |
| Modéliser des "modes" orthogonaux | Quand un seul aspect varie |

## Réflexion

Un formulaire avec validation en temps réel : états parallèles ou non ?

<details>
<summary>Pistes</summary>

Ça dépend ! Si chaque champ est validé indépendamment (email valide/invalide, mot de passe valide/invalide), ça pourrait être parallèle.

Mais souvent, la validation globale dépend de tous les champs. Dans ce cas, un état unique avec un contexte contenant les erreurs est plus simple.

Règle : ne pas forcer le parallélisme si le modèle mental est séquentiel.
</details>

## Fichier d'exercice

Ouvre `exercice.ts` pour créer une machine de mode édition de document.
