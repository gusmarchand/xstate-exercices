# Module 6 - Actors et Services Asynchrones

## Le problème

Les machines à états sont synchrones. Mais le monde réel est asynchrone :
- Appels API
- Timers
- WebSockets
- Animations

## Les Actors dans XState v5

XState v5 introduit le concept d'**actors** : des entités qui peuvent :
- Exécuter du code asynchrone
- Envoyer des événements à leur parent
- Être démarrés/arrêtés par la machine

## Invoquer une Promise

```typescript
import { createMachine, fromPromise } from 'xstate';

const fetchUserMachine = createMachine({
  id: 'fetchUser',
  initial: 'idle',
  context: {
    user: null,
    error: null
  },
  states: {
    idle: {
      on: { FETCH: 'loading' }
    },
    loading: {
      invoke: {
        id: 'fetchUser',
        src: fromPromise(async ({ input }) => {
          const response = await fetch(`/api/users/${input.userId}`);
          if (!response.ok) throw new Error('Failed to fetch');
          return response.json();
        }),
        input: ({ event }) => ({ userId: event.userId }),
        onDone: {
          target: 'success',
          actions: assign({
            user: ({ event }) => event.output
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => event.error.message
          })
        }
      }
    },
    success: {},
    failure: {
      on: { RETRY: 'loading' }
    }
  }
});
```

## Les différents types d'actors

### 1. `fromPromise` - Pour les opérations one-shot

```typescript
src: fromPromise(async ({ input }) => {
  // Retourne une valeur ou throw une erreur
  return await fetchData(input.id);
})
```

### 2. `fromCallback` - Pour les subscriptions

```typescript
import { fromCallback } from 'xstate';

src: fromCallback(({ sendBack, input }) => {
  const interval = setInterval(() => {
    sendBack({ type: 'TICK' });
  }, 1000);

  // Fonction de cleanup
  return () => clearInterval(interval);
})
```

### 3. `fromObservable` - Pour les streams RxJS

```typescript
import { fromObservable } from 'xstate';
import { interval } from 'rxjs';

src: fromObservable(() => interval(1000))
```

## Passer des données à l'actor

```typescript
invoke: {
  src: fromPromise(async ({ input }) => {
    // input contient les données passées
    return await fetchUser(input.userId);
  }),
  input: ({ context, event }) => ({
    userId: event.userId,
    token: context.authToken
  })
}
```

## Invoquer un autre machine (actor enfant)

```typescript
const childMachine = createMachine({ /* ... */ });

const parentMachine = createMachine({
  states: {
    active: {
      invoke: {
        id: 'child',
        src: childMachine,
        onDone: 'completed'
      }
    }
  }
});
```

## Communication parent ↔ enfant

```typescript
// Enfant envoie au parent
const childMachine = createMachine({
  // ...
  states: {
    done: {
      entry: sendParent({ type: 'CHILD_DONE', data: 'result' })
    }
  }
});

// Parent reçoit
const parentMachine = createMachine({
  states: {
    active: {
      invoke: { src: childMachine },
      on: {
        CHILD_DONE: {
          actions: ({ event }) => console.log(event.data)
        }
      }
    }
  }
});
```

## Réflexion

Quelle est la différence entre :
1. Mettre la logique async dans une action
2. Utiliser `invoke` avec `fromPromise`

<details>
<summary>Réponse</summary>

**Action async** (fire-and-forget) :
- La machine ne "sait" pas que l'opération est en cours
- Pas de gestion native du succès/échec
- Pas d'annulation automatique si on change d'état

**invoke** :
- L'état "sait" qu'un service tourne
- Gestion déclarative de onDone/onError
- Annulation automatique si on quitte l'état
- Testable et visualisable

Règle : si le résultat de l'async affecte l'état, utilise `invoke`.
</details>

## Fichier d'exercice

Ouvre `exercice.ts` pour créer une machine de recherche avec debounce.
