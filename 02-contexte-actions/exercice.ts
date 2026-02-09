/**
 * EXERCICE 2 : Panier d'achat
 *
 * Cree une machine pour un panier d'achat avec :
 *
 * ETATS :
 * - 'empty' (etat initial) : le panier est vide
 * - 'hasItems' : le panier contient des articles
 *
 * CONTEXTE :
 * - items: [] (tableau de CartItem)
 * - total: 0 (prix total)
 *
 * EVENEMENTS :
 * - ADD_ITEM : { id: string, name: string, price: number }
 *   → Ajoute un item et met a jour le total
 *   → Depuis 'empty', passe a 'hasItems'
 *
 * - REMOVE_ITEM : { id: string }
 *   → Retire l'item et met a jour le total
 *   → Si c'etait le dernier item, retour a 'empty'
 *
 * - CLEAR :
 *   → Vide tout le panier, retour a 'empty'
 *
 * INDICE : Utilise assign() pour modifier le contexte
 * INDICE : Pour REMOVE_ITEM, utilise une transition conditionnelle (tableau)
 *          avec un guard pour verifier si c'est le dernier item
 */

import { createMachine, createActor, assign } from 'xstate';

type CartItem = {
  id: string;
  name: string;
  price: number;
};

const cartMachine = createMachine({
  id: 'cart',
  initial: 'empty',
  context: {
    items: [] as CartItem[],
    total: 0
  },
  states: {
    empty: {
      on: {
        ADD_ITEM: {
          // TODO: target → 'hasItems'
          // TODO: actions → assign pour ajouter l'item et mettre a jour total
        }
      }
    },
    hasItems: {
      on: {
        ADD_ITEM: {
          // TODO: actions → assign pour ajouter l'item et mettre a jour total
          // (reste dans 'hasItems')
        },
        REMOVE_ITEM: [
          {
            // TODO: Guard → verifier si c'est le dernier item
            // Si oui : target → 'empty', reset items et total
          },
          {
            // TODO: Sinon : retirer l'item et mettre a jour le total
          }
        ],
        CLEAR: {
          // TODO: target → 'empty', reset items et total
        }
      }
    }
  }
});

// === TESTS ===

const actor = createActor(cartMachine);
actor.start();

console.log('Initial:', actor.getSnapshot().value, actor.getSnapshot().context);
// Attendu: 'empty' { items: [], total: 0 }

actor.send({ type: 'ADD_ITEM', id: '1', name: 'T-shirt', price: 25 });
console.log('Apres ADD:', actor.getSnapshot().value, actor.getSnapshot().context);
// Attendu: 'hasItems' { items: [{ id: '1', name: 'T-shirt', price: 25 }], total: 25 }

actor.send({ type: 'ADD_ITEM', id: '2', name: 'Pantalon', price: 50 });
console.log('Apres ADD:', actor.getSnapshot().context);
// Attendu: { items: [...2 items], total: 75 }

actor.send({ type: 'REMOVE_ITEM', id: '1' });
console.log('Apres REMOVE:', actor.getSnapshot().context);
// Attendu: { items: [{ id: '2', ... }], total: 50 }

actor.send({ type: 'REMOVE_ITEM', id: '2' });
console.log('Apres dernier REMOVE:', actor.getSnapshot().value);
// Attendu: 'empty'
