# Module 0 - Qu'est-ce qu'une Machine à États ?

## Avant XState : comprendre le problème

### Le chaos du state management classique

Imagine un formulaire de login. Avec une approche classique :

```typescript
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
```

**Problèmes :**
- États impossibles : `isLoading: true` ET `isSuccess: true` en même temps ?
- Transitions implicites : rien n'empêche de passer de `success` à `loading`
- Logique dispersée : les conditions sont éparpillées dans le code

### La solution : penser en états exclusifs

Une machine à états dit : **"À tout moment, mon système est dans UN SEUL état bien défini"**

```
        ┌─────────┐
        │  IDLE   │
        └────┬────┘
             │ submit
             ▼
        ┌─────────┐
   ┌────│ LOADING │────┐
   │    └─────────┘    │
   │ error          success
   ▼                   ▼
┌─────────┐      ┌─────────┐
│  ERROR  │      │ SUCCESS │
└────┬────┘      └─────────┘
     │ retry
     └──────────────┐
                    ▼
               ┌─────────┐
               │ LOADING │
               └─────────┘
```

## Vocabulaire de base

| Terme | Description | Exemple |
|-------|-------------|---------|
| **État (State)** | Situation actuelle du système | `idle`, `loading`, `error` |
| **Transition** | Passage d'un état à un autre | `idle` → `loading` |
| **Événement (Event)** | Ce qui déclenche une transition | `SUBMIT`, `RETRY` |
| **Action** | Effet secondaire lors d'une transition | Envoyer une requête API |
| **Guard** | Condition pour autoriser une transition | "seulement si email valide" |

## Exercice mental

Pense à un lecteur audio (play/pause/stop).

**Questions :**
1. Quels sont les états possibles ?
2. Quels événements peuvent se produire ?
3. Depuis l'état "stopped", quels événements sont valides ?
4. Depuis l'état "playing", peut-on aller directement à "stopped" ?

<details>
<summary>Réflexion guidée</summary>

États possibles : `stopped`, `playing`, `paused`

Événements : `PLAY`, `PAUSE`, `STOP`

Depuis `stopped` : seul `PLAY` a du sens
Depuis `playing` : `PAUSE` et `STOP` sont valides
Depuis `paused` : `PLAY` et `STOP` sont valides

C'est ça la puissance d'une FSM : elle **interdit** les transitions illogiques.
</details>

---

**Prochaine étape :** [Module 1 - Ta première machine XState](../01-premiere-machine/README.md)
