# Module 7 - Intégration React

## Installation

```bash
npm install xstate @xstate/react
```

## Le hook `useMachine`

C'est le hook principal pour utiliser une machine dans un composant :

```tsx
import { useMachine } from '@xstate/react';
import { toggleMachine } from './toggleMachine';

function Toggle() {
  const [snapshot, send] = useMachine(toggleMachine);

  return (
    <button onClick={() => send({ type: 'TOGGLE' })}>
      {snapshot.matches('active') ? 'ON' : 'OFF'}
    </button>
  );
}
```

## Anatomie du retour

```typescript
const [snapshot, send, actorRef] = useMachine(machine);

// snapshot : l'état actuel
snapshot.value;          // L'état ('idle', { parent: 'child' }, etc.)
snapshot.context;        // Les données
snapshot.matches('...')  // Test d'état

// send : envoyer des événements
send({ type: 'SUBMIT', data: 'value' });

// actorRef : référence à l'acteur (avancé)
actorRef.subscribe(...)
```

## Passer un contexte initial

```tsx
const [snapshot, send] = useMachine(formMachine, {
  input: {
    initialEmail: props.email,
    userId: props.userId
  }
});
```

Côté machine :

```typescript
const formMachine = createMachine({
  context: ({ input }) => ({
    email: input.initialEmail || '',
    userId: input.userId
  }),
  // ...
});
```

## Le hook `useSelector`

Pour des re-renders optimisés, sélectionne uniquement ce dont tu as besoin :

```tsx
import { useSelector } from '@xstate/react';

function UserCount({ actorRef }) {
  // Ne re-render QUE quand count change
  const count = useSelector(actorRef, (snapshot) => snapshot.context.count);

  return <span>{count}</span>;
}
```

## Le hook `useActorRef`

Quand tu veux créer un acteur sans provoquer de re-renders :

```tsx
import { useActorRef } from '@xstate/react';

function App() {
  const actorRef = useActorRef(myMachine);

  // Passe la ref aux enfants
  return <Child actorRef={actorRef} />;
}

function Child({ actorRef }) {
  const state = useSelector(actorRef, (s) => s.value);
  // ...
}
```

## Pattern : Machine Provider

Pour partager une machine dans l'arbre de composants :

```tsx
import { createContext, useContext } from 'react';
import { useActorRef, useSelector } from '@xstate/react';

const MachineContext = createContext(null);

export function MachineProvider({ children }) {
  const actorRef = useActorRef(appMachine);
  return (
    <MachineContext.Provider value={actorRef}>
      {children}
    </MachineContext.Provider>
  );
}

export function useAppMachine() {
  return useContext(MachineContext);
}

export function useAppSelector(selector) {
  const actorRef = useAppMachine();
  return useSelector(actorRef, selector);
}

// Usage
function SomeComponent() {
  const isLoading = useAppSelector((s) => s.matches('loading'));
  const send = useAppMachine().send;
  // ...
}
```

## Erreurs courantes

### 1. Recréer la machine à chaque render

```tsx
// ❌ MAUVAIS - nouvelle machine à chaque render
function Bad() {
  const machine = createMachine({ /* ... */ });
  const [snapshot] = useMachine(machine);
}

// ✅ BON - machine définie hors du composant
const myMachine = createMachine({ /* ... */ });

function Good() {
  const [snapshot] = useMachine(myMachine);
}
```

### 2. Oublier le type de l'événement

```tsx
// ❌ MAUVAIS
send({ value: 'hello' });

// ✅ BON
send({ type: 'UPDATE', value: 'hello' });
```

### 3. Tester l'état avec ===

```tsx
// ❌ MAUVAIS (fragile avec états imbriqués)
if (snapshot.value === 'loading') { }

// ✅ BON
if (snapshot.matches('loading')) { }
```

## Réflexion

Quand utiliser `useMachine` vs `useActorRef` + `useSelector` ?

<details>
<summary>Pistes</summary>

**`useMachine`** : Simple, direct. Bon pour des composants isolés ou des machines locales.

**`useActorRef` + `useSelector`** :
- Quand la machine est partagée entre composants
- Pour optimiser les re-renders (selector granulaire)
- Quand tu veux séparer "qui contrôle" de "qui observe"

En général, commence avec `useMachine`. Refactorise si tu as des problèmes de perf.
</details>

## Fichier d'exercice

Ouvre `exercice.tsx` pour créer un formulaire de login complet avec React.
