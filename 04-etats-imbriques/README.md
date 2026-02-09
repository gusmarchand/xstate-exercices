# Module 4 - États Imbriqués (Hierarchical States)

## Le problème de la duplication

Imagine une machine avec des états `loggedIn.dashboard`, `loggedIn.profile`, `loggedIn.settings`.

Depuis chacun de ces états, l'utilisateur peut se déconnecter. Sans hiérarchie :

```typescript
// ❌ Duplication
states: {
  dashboard: {
    on: { LOGOUT: 'loggedOut' }  // Dupliqué
  },
  profile: {
    on: { LOGOUT: 'loggedOut' }  // Dupliqué
  },
  settings: {
    on: { LOGOUT: 'loggedOut' }  // Dupliqué
  }
}
```

## États imbriqués : la solution

```typescript
// ✅ Hiérarchie
states: {
  loggedOut: { /* ... */ },
  loggedIn: {
    // Transition commune à tous les sous-états
    on: {
      LOGOUT: 'loggedOut'
    },
    initial: 'dashboard',
    states: {
      dashboard: { /* ... */ },
      profile: { /* ... */ },
      settings: { /* ... */ }
    }
  }
}
```

## Comment ça fonctionne ?

```
┌─────────────────────────────────────────┐
│              loggedIn                    │
│  ┌───────────┐ ┌─────────┐ ┌──────────┐ │
│  │ dashboard │ │ profile │ │ settings │ │
│  └───────────┘ └─────────┘ └──────────┘ │
│                                          │
│  [LOGOUT] ─────────────────────────────────→ loggedOut
└─────────────────────────────────────────┘
```

L'événement `LOGOUT` est "capturé" par l'état parent `loggedIn`, peu importe le sous-état actif.

## Accéder à l'état complet

```typescript
actor.getSnapshot().value;
// Retourne : { loggedIn: 'dashboard' }

// Pour tester un état spécifique :
actor.getSnapshot().matches('loggedIn');           // true
actor.getSnapshot().matches('loggedIn.dashboard'); // true
actor.getSnapshot().matches({ loggedIn: 'profile' }); // false
```

## Transitions entre sous-états

```typescript
states: {
  loggedIn: {
    initial: 'dashboard',
    states: {
      dashboard: {
        on: {
          GO_TO_PROFILE: 'profile',    // Sibling (même niveau)
          GO_TO_SETTINGS: 'settings'   // Sibling aussi
        }
      },
      profile: { /* ... */ },
      settings: { /* ... */ }
    }
  }
}
```

### Syntaxe avec `.` (point)

Le préfixe `.` cible un **état enfant** de l'état courant, pas un sibling :

```typescript
dashboard: {
  initial: 'overview',
  states: {
    overview: {
      on: {
        VIEW_STATS: '.stats'  // → dashboard.stats (enfant)
      }
    },
    stats: { /* ... */ }
  }
}
```

| Syntaxe | Cible |
|---------|-------|
| `'profile'` | Sibling ou résolu par le parent |
| `'.child'` | Sous-état de l'état courant |
| `'#id'` | État avec cet ID (n'importe où) |
| `'#machineId.path'` | Chemin absolu depuis la racine |

### Cibler un état distant avec `#`

Pour cibler un état dans une autre branche de l'arbre, utilise un ID :

```typescript
const machine = setup({}).createMachine({
  id: 'app',
  initial: 'loggedIn',
  states: {
    loggedOut: { /* ... */ },
    loggedIn: {
      initial: 'dashboard',
      states: {
        dashboard: {
          on: {
            // Chemin absolu depuis la racine
            LOGOUT: '#app.loggedOut'
          }
        }
      }
    }
  }
});
```

Tu peux aussi assigner un ID à n'importe quel état pour le cibler directement :

```typescript
states: {
  deeply: {
    states: {
      nested: {
        id: 'targetState',  // ID unique
      }
    }
  },
  other: {
    on: {
      JUMP: '#targetState'  // Cible directe
    }
  }
}
```

## États finaux et `onDone`

Un sous-état peut être "final", ce qui déclenche un événement sur le parent :

```typescript
states: {
  checkout: {
    initial: 'payment',
    onDone: 'confirmation',  // Quand checkout atteint un état final
    states: {
      payment: {
        on: { PAY: 'processing' }
      },
      processing: {
        on: { SUCCESS: 'complete' }
      },
      complete: {
        type: 'final'  // ← Déclenche onDone du parent
      }
    }
  },
  confirmation: { /* ... */ }
}
```

## Réflexion architecturale

Quand utiliser des états imbriqués vs des états "plats" ?

<details>
<summary>Pistes</summary>

**États imbriqués** quand :
- Plusieurs états partagent des transitions communes
- Il y a une notion de "mode" ou "contexte" englobant
- Tu veux modéliser un sous-processus avec son propre flux

**États plats** quand :
- Les états sont vraiment indépendants
- La hiérarchie ajouterait de la complexité inutile
- Tu débutes (commence simple, refactorise si nécessaire)
</details>

## Fichier d'exercice

Ouvre `exercice.ts` pour créer une machine de processus d'inscription multi-étapes.
