/**
 * EXERCICE 3 : Distributeur automatique
 *
 * Cree une machine pour un distributeur automatique avec :
 *
 * ETATS :
 * - 'idle' (etat initial) : en attente
 * - 'selecting' : un produit a ete selectionne
 * - 'dispensing' : distribution en cours
 *
 * CONTEXTE :
 * - balance: 0 (argent insere en centimes)
 * - selectedProduct: null (produit selectionne)
 * - products: [...] (liste des produits disponibles)
 *
 * EVENEMENTS :
 * - INSERT_COIN : { amount: number } → ajoute de l'argent
 * - SELECT_PRODUCT : { name: string } → selectionne un produit
 * - CONFIRM : confirme l'achat
 * - CANCEL : annule et rend la monnaie
 *
 * GUARDS (a definir dans le 2e argument de createMachine) :
 * - 'productExists' : verifie que le produit existe dans la liste
 * - 'hasEnoughMoney' : verifie que la balance >= prix du produit
 *
 * LOGIQUE :
 * - INSERT_COIN : ajoute amount a la balance (depuis idle OU selecting)
 * - SELECT_PRODUCT : si le produit existe → 'selecting'
 * - CONFIRM : si assez d'argent → 'dispensing' (deduit le prix)
 * - CANCEL : rend la monnaie (log), retour a 'idle', reset balance et selectedProduct
 * - 'dispensing' : log la distribution, puis retour automatique a 'idle'
 *   (utilise 'always' pour la transition automatique)
 */

import { createMachine, createActor, assign } from 'xstate';

type Product = {
  name: string;
  price: number;
};

const vendingMachine = createMachine(
  {
    id: 'vending',
    initial: 'idle',
    context: {
      balance: 0,
      selectedProduct: null as Product | null,
      products: [
        { name: 'Cafe', price: 150 },
        { name: 'The', price: 100 },
        { name: 'Chocolat', price: 200 }
      ] as Product[]
    },
    states: {
      idle: {
        on: {
          INSERT_COIN: {
            // TODO: action → ajouter event.amount a la balance
          },
          SELECT_PRODUCT: {
            // TODO: target → 'selecting'
            // TODO: guard → 'productExists'
            // TODO: action → sauvegarder le produit selectionne dans selectedProduct
          }
        }
      },
      selecting: {
        on: {
          INSERT_COIN: {
            // TODO: action → ajouter event.amount a la balance
          },
          CONFIRM: {
            // TODO: target → 'dispensing'
            // TODO: guard → 'hasEnoughMoney'
            // TODO: action → deduire le prix du produit de la balance
          },
          CANCEL: {
            // TODO: target → 'idle'
            // TODO: actions → log monnaie rendue + reset balance et selectedProduct
          }
        }
      },
      dispensing: {
        // TODO: entry → log le produit distribue et la monnaie rendue
        // TODO: always → transition automatique vers 'idle' avec reset
      }
    }
  },
  {
    guards: {
      productExists: ({ context, event }) => {
        // TODO: Verifie que event.name existe dans context.products
        return false;
      },
      hasEnoughMoney: ({ context }) => {
        // TODO: Verifie que balance >= prix du selectedProduct
        return false;
      }
    }
  }
);

// === TESTS ===

const actor = createActor(vendingMachine);
actor.start();

console.log('=== Test 1: Selection sans argent ===');
actor.send({ type: 'SELECT_PRODUCT', name: 'Cafe' });
console.log('Etat:', actor.getSnapshot().value);
// Attendu: 'selecting'

actor.send({ type: 'CONFIRM' });
console.log('Confirm sans argent:', actor.getSnapshot().value);
// Attendu: 'selecting' (guard bloque)

console.log('\n=== Test 2: Ajout d\'argent ===');
actor.send({ type: 'INSERT_COIN', amount: 100 });
console.log('Balance:', actor.getSnapshot().context.balance);
// Attendu: 100

actor.send({ type: 'CONFIRM' });
console.log('Confirm avec 100:', actor.getSnapshot().value);
// Attendu: 'selecting' (pas assez pour le cafe a 150)

actor.send({ type: 'INSERT_COIN', amount: 50 });
actor.send({ type: 'CONFIRM' });
console.log('Confirm avec 150:', actor.getSnapshot().value);
// Attendu: 'idle' (distribue puis retour automatique)

console.log('\n=== Test 3: Produit inexistant ===');
const actor2 = createActor(vendingMachine);
actor2.start();
actor2.send({ type: 'SELECT_PRODUCT', name: 'Biere' });
console.log('Selection Biere:', actor2.getSnapshot().value);
// Attendu: 'idle' (guard bloque)
