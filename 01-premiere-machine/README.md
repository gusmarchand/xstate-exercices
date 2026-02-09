# Module 1 - Ta première machine XState

## Setup

```bash
npm init -y
npm install xstate
```

## Anatomie d'une machine

```typescript
import { createMachine } from 'xstate';

const toggleMachine = createMachine({
  id: 'toggle',           // Identifiant unique
  initial: 'inactive',    // État de départ
  states: {
    inactive: {
      on: {
        TOGGLE: 'active'  // Event → État cible
      }
    },
    active: {
      on: {
        TOGGLE: 'inactive'
      }
    }
  }
});
```

## Interpréter une machine

La machine seule est une **définition statique**. Pour l'exécuter :

```typescript
import { createActor } from 'xstate';

// Créer un acteur à partir de la machine
const actor = createActor(toggleMachine);

// S'abonner aux changements d'état
actor.subscribe((snapshot) => {
  console.log('État actuel:', snapshot.value);
});

// Démarrer l'acteur
actor.start();

// Envoyer des événements
actor.send({ type: 'TOGGLE' }); // → 'active'
actor.send({ type: 'TOGGLE' }); // → 'inactive'
```

## Concepts clés

### 1. La machine est **pure**
Elle ne fait que décrire les états et transitions possibles. Pas d'effets de bord.

### 2. L'acteur est **l'exécution**
C'est lui qui maintient l'état courant et réagit aux événements.

### 3. Le snapshot est **immutable**
Chaque changement produit un nouveau snapshot, jamais de mutation.

## Fichier d'exercice

Ouvre `exercice.ts` et complète la machine du lecteur audio.
