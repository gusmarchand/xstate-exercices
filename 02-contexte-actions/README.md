# Module 2 - Contexte et Actions

## Le problème des données

Une machine à états gère les **états finis** (idle, loading, error...).
Mais comment gérer les **données infinies** ? (compteur, texte, objets...)

C'est le rôle du **contexte**.

## Contexte : les données de ta machine

```typescript
import { createMachine, assign } from 'xstate';

const counterMachine = createMachine({
  id: 'counter',
  initial: 'active',
  context: {
    count: 0,        // ← Données initiales
    max: 10
  },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({
            count: ({ context }) => context.count + 1
          })
        },
        DECREMENT: {
          actions: assign({
            count: ({ context }) => context.count - 1
          })
        }
      }
    }
  }
});
```

## Actions : les effets secondaires

Les actions s'exécutent lors des transitions. Plusieurs types :

### 1. `assign` - Modifier le contexte

```typescript
actions: assign({
  count: ({ context }) => context.count + 1
})
```

### 2. Actions personnalisées

```typescript
actions: [
  assign({ count: ({ context }) => context.count + 1 }),
  ({ context }) => console.log('Nouveau count:', context.count)
]
```

### 3. Actions avec l'événement

```typescript
on: {
  SET_VALUE: {
    actions: assign({
      // event contient les données envoyées
      value: ({ event }) => event.value
    })
  }
}

// Usage :
actor.send({ type: 'SET_VALUE', value: 42 });
```

## Quand s'exécutent les actions ?

```typescript
states: {
  idle: {
    entry: [/* actions à l'ENTRÉE dans cet état */],
    exit: [/* actions à la SORTIE de cet état */],
    on: {
      SUBMIT: {
        target: 'loading',
        actions: [/* actions PENDANT la transition */]
      }
    }
  }
}
```

## Point de réflexion

Pourquoi utiliser `assign` plutôt que modifier directement le contexte ?

<details>
<summary>Indice</summary>

Pense à : immutabilité, prédictibilité, debugging, time-travel...

XState garantit que chaque snapshot est immutable. `assign` crée un **nouveau** contexte plutôt que de muter l'existant.
</details>

## Fichier d'exercice

Ouvre `exercice.ts` pour créer une machine de panier d'achat.
