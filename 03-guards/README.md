# Module 3 - Guards (Conditions)

## Le problème

Parfois, une transition ne doit se produire que **sous certaines conditions**.

Exemple : un formulaire ne peut être soumis que si les champs sont valides.

## Guards : les gardiens des transitions

```typescript
const formMachine = createMachine({
  id: 'form',
  initial: 'editing',
  context: {
    email: '',
    password: ''
  },
  states: {
    editing: {
      on: {
        SUBMIT: {
          target: 'submitting',
          guard: ({ context }) => {
            // La transition n'a lieu QUE si cette fonction retourne true
            return context.email.includes('@') && context.password.length >= 8;
          }
        }
      }
    },
    submitting: { /* ... */ }
  }
});
```

## Guards nommés (meilleure pratique)

Pour la lisibilité et la testabilité, nomme tes guards :

```typescript
const formMachine = createMachine(
  {
    // ...
    states: {
      editing: {
        on: {
          SUBMIT: {
            target: 'submitting',
            guard: 'isFormValid'  // ← Référence par nom
          }
        }
      }
    }
  },
  {
    guards: {
      isFormValid: ({ context }) => {
        return context.email.includes('@') && context.password.length >= 8;
      }
    }
  }
);
```

## Transitions conditionnelles multiples

Tu peux avoir plusieurs transitions pour le même événement :

```typescript
on: {
  SUBMIT: [
    {
      target: 'premium',
      guard: 'isPremiumUser'
    },
    {
      target: 'standard',
      guard: 'isStandardUser'
    },
    {
      target: 'error'
      // Pas de guard = fallback (toujours matché si les autres échouent)
    }
  ]
}
```

**Important :** L'ordre compte ! La première condition vraie gagne.

## Guard avec données de l'événement

```typescript
on: {
  LOGIN: {
    target: 'authenticated',
    guard: ({ event }) => event.role === 'admin'
  }
}

// Usage :
actor.send({ type: 'LOGIN', role: 'admin' });
```

## Combiner plusieurs guards

```typescript
guards: {
  isFormValid: and(['hasValidEmail', 'hasValidPassword']),
  canSubmit: or(['isAdmin', 'hasPermission']),
  isNotBlocked: not('isBlocked')
}
```

## Réflexion

Quelle est la différence entre :
1. Ne pas définir de transition pour un événement
2. Définir une transition avec un guard qui retourne false

<details>
<summary>Réponse</summary>

Comportement observable : identique (l'événement est ignoré).

Mais sémantiquement :
- Pas de transition = "cet événement n'a pas de sens dans cet état"
- Guard false = "cet événement a du sens, mais les conditions ne sont pas réunies"

Utile pour le debugging et la documentation de ta machine.
</details>

## Fichier d'exercice

Ouvre `exercice.ts` pour créer une machine de distributeur automatique.
