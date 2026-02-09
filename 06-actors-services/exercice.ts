/**
 * EXERCICE 6 : Recherche avec debounce
 *
 * Cree une machine de recherche qui :
 * 1. Attend 300ms apres la derniere frappe (debounce)
 * 2. Lance la recherche
 * 3. Affiche les resultats ou l'erreur
 *
 * ETATS :
 * - 'idle' : en attente de saisie
 * - 'debouncing' : attente du delai avant recherche
 * - 'searching' : recherche en cours
 * - 'results' : resultats affiches
 * - 'error' : erreur de recherche
 *
 * CONTEXTE :
 * - query: '' (terme de recherche)
 * - results: [] (resultats)
 * - error: null
 *
 * EVENEMENTS :
 * - TYPE : { value: string } - l'utilisateur tape
 * - CLEAR : efface la recherche
 *
 * LOGIQUE :
 * - TYPE depuis n'importe ou → 'debouncing' (reset le timer)
 * - Apres 300ms de debounce → 'searching'
 * - Recherche reussie → 'results'
 * - Recherche echouee → 'error'
 * - CLEAR → 'idle' avec reset du contexte
 *
 * INDICE : Utilise fromCallback pour le debounce timer
 *          Utilise fromPromise pour la recherche
 */

import {
  createMachine,
  createActor,
  assign,
  fromPromise,
  fromCallback
} from 'xstate';

// Fonction de recherche simulee
const searchApi = async (query: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (query === 'error') throw new Error('Search failed');
  return [`Result 1 for "${query}"`, `Result 2 for "${query}"`];
};

const searchMachine = createMachine({
  id: 'search',
  initial: 'idle',
  context: {
    query: '',
    results: [] as string[],
    error: null as string | null
  },
  states: {
    idle: {
      on: {
        TYPE: {
          // TODO: Aller vers 'debouncing' et sauvegarder query
        }
      }
    },

    debouncing: {
      on: {
        TYPE: {
          // TODO: Rester dans 'debouncing' mais mettre a jour query
          // (cela va re-invoquer le service et reset le timer)
          // INDICE: utilise 'reenter: true'
        },
        CLEAR: {
          // TODO: Retour a idle avec reset
        }
      },
      invoke: {
        id: 'debounceTimer',
        // TODO: Utilise fromCallback pour creer un timer de 300ms
        // Quand le timer expire, envoie { type: 'DEBOUNCE_DONE' }
        src: fromCallback(({ sendBack }) => {
          // A completer
        }),
      },
      on: {
        DEBOUNCE_DONE: 'searching'
      }
    },

    searching: {
      invoke: {
        id: 'searchApi',
        // TODO: Utilise fromPromise pour appeler searchApi
        src: fromPromise(async ({ input }) => {
          // A completer - input.query contient le terme
        }),
        input: ({ context }) => ({ query: context.query }),
        onDone: {
          // TODO: Aller vers 'results' et sauvegarder les resultats
        },
        onError: {
          // TODO: Aller vers 'error' et sauvegarder l'erreur
        }
      },
      on: {
        TYPE: {
          // TODO: Nouvelle frappe = retour au debouncing
        }
      }
    },

    results: {
      on: {
        TYPE: {
          // TODO: Nouvelle recherche
        },
        CLEAR: {
          // TODO: Reset
        }
      }
    },

    error: {
      on: {
        TYPE: {
          // TODO: Nouvelle recherche
        },
        CLEAR: {
          // TODO: Reset
        }
      }
    }
  }
});

// === TESTS ===

const actor = createActor(searchMachine);

actor.subscribe((snapshot) => {
  console.log('State:', snapshot.value, '| Query:', snapshot.context.query);
});

actor.start();

// Simule la frappe
console.log('\n=== Simulation de frappe ===');
actor.send({ type: 'TYPE', value: 'h' });
actor.send({ type: 'TYPE', value: 'he' });
actor.send({ type: 'TYPE', value: 'hel' });
actor.send({ type: 'TYPE', value: 'hello' });

// Attendre les resultats (debounce + search)
setTimeout(() => {
  console.log('\nResultats:', actor.getSnapshot().context.results);
}, 1500);
