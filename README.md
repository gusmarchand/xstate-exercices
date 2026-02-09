# Apprendre XState - Cours Progressif

Un parcours d'apprentissage de XState v5, de zero a l'integration React.

## Setup

```bash
npm install
```

Pour executer les fichiers TypeScript :
```bash
npx tsx 01-premiere-machine/exercice.ts
```

## Parcours

| Module | Sujet | Concepts |
|--------|-------|----------|
| [00](./00-introduction/) | Introduction aux FSM | Etats, transitions, evenements |
| [01](./01-premiere-machine/) | Premiere machine | `createMachine`, `createActor`, `send` |
| [02](./02-contexte-actions/) | Contexte et Actions | `context`, `assign`, actions |
| [03](./03-guards/) | Guards | Conditions, transitions multiples |
| [04](./04-etats-imbriques/) | Etats imbriques | Hierarchical states, `onDone` |
| [05](./05-etats-paralleles/) | Etats paralleles | `type: 'parallel'`, regions |
| [06](./06-actors-services/) | Actors & Services | `invoke`, `fromPromise`, `fromCallback` |
| [07](./07-integration-react/) | Integration React | `useMachine`, `useSelector` |
| [08](./08-projet-final/) | Projet Final | Application de Chat complete |

## Structure de chaque module

```
XX-nom-module/
├── README.md      # Explications et concepts
└── exercice.ts    # Exercice a completer
```

## Comment utiliser

1. **Lis le README** du module pour comprendre les concepts
2. **Ouvre l'exercice** et essaie de le completer
3. **Execute ton code** avec `npx tsx XX-module/exercice.ts`
4. **Verifie** que les tests en bas de fichier produisent les resultats attendus

## Tips

### Visualiser ta machine

Copie ta machine dans [Stately Viz](https://stately.ai/viz) pour la voir graphiquement.

### Debugger

```typescript
const actor = createActor(myMachine);

// Log tous les changements d'etat
actor.subscribe((snapshot) => {
  console.log('State:', snapshot.value);
  console.log('Context:', snapshot.context);
});

actor.start();
```

### TypeScript strict

Pour un typage complet de ta machine :

```typescript
const machine = createMachine({
  types: {} as {
    context: { count: number };
    events: { type: 'INCREMENT' } | { type: 'DECREMENT' };
  },
  context: { count: 0 },
  // ...
});
```
