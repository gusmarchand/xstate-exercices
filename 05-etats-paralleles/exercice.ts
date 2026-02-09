/**
 * EXERCICE 5 : Editeur de document
 *
 * Cree une machine pour un editeur de texte avec des modes paralleles :
 *
 * REGIONS PARALLELES :
 *
 * 1. editMode (mode d'edition)
 *    - 'viewing' : lecture seule
 *    - 'editing' : modification possible
 *    Evenements : EDIT, VIEW
 *
 * 2. saveStatus (etat de sauvegarde)
 *    - 'saved' : tout est sauvegarde
 *    - 'unsaved' : modifications non sauvegardees
 *    - 'saving' : sauvegarde en cours
 *    Evenements : MODIFY, SAVE, SAVE_SUCCESS, SAVE_ERROR
 *
 * 3. toolbar (barre d'outils)
 *    - 'visible' : affichee
 *    - 'hidden' : masquee
 *    Evenements : TOGGLE_TOOLBAR
 *
 * LOGIQUE SPECIALE :
 * - MODIFY ne devrait marquer 'unsaved' que si on est en mode 'editing'
 *   (indice: tu peux utiliser un guard qui verifie l'etat d'une autre region)
 * - SAVE depuis 'unsaved' → 'saving' → 'saved' (ou retour a 'unsaved' si erreur)
 */

import { createMachine, createActor } from 'xstate';

const editorMachine = createMachine({
  id: 'editor',
  type: 'parallel',
  states: {
    editMode: {
      initial: 'viewing',
      states: {
        viewing: {
          on: {
            // TODO: EDIT → editing
          }
        },
        editing: {
          on: {
            // TODO: VIEW → viewing
          }
        }
      }
    },

    saveStatus: {
      initial: 'saved',
      states: {
        saved: {
          on: {
            // TODO: MODIFY → unsaved
            // BONUS: Seulement si editMode est 'editing'
          }
        },
        unsaved: {
          on: {
            // TODO: MODIFY reste dans unsaved (rien a faire, ou action de log)
            // TODO: SAVE → saving
          }
        },
        saving: {
          on: {
            // TODO: SAVE_SUCCESS → saved
            // TODO: SAVE_ERROR → unsaved
          }
        }
      }
    },

    toolbar: {
      initial: 'visible',
      states: {
        visible: {
          on: {
            // TODO: TOGGLE_TOOLBAR → hidden
          }
        },
        hidden: {
          on: {
            // TODO: TOGGLE_TOOLBAR → visible
          }
        }
      }
    }
  }
});

// === TESTS ===

const actor = createActor(editorMachine);
actor.start();

console.log('Initial:', actor.getSnapshot().value);
// Attendu: { editMode: 'viewing', saveStatus: 'saved', toolbar: 'visible' }

actor.send({ type: 'EDIT' });
console.log('Apres EDIT:', actor.getSnapshot().value);
// Attendu: { editMode: 'editing', saveStatus: 'saved', toolbar: 'visible' }

actor.send({ type: 'MODIFY' });
console.log('Apres MODIFY:', actor.getSnapshot().value);
// Attendu: { editMode: 'editing', saveStatus: 'unsaved', toolbar: 'visible' }

actor.send({ type: 'TOGGLE_TOOLBAR' });
console.log('Apres TOGGLE:', actor.getSnapshot().value);
// Attendu: { editMode: 'editing', saveStatus: 'unsaved', toolbar: 'hidden' }

actor.send({ type: 'SAVE' });
console.log('Apres SAVE:', actor.getSnapshot().value);
// Attendu: { editMode: 'editing', saveStatus: 'saving', toolbar: 'hidden' }

actor.send({ type: 'SAVE_SUCCESS' });
console.log('Apres SUCCESS:', actor.getSnapshot().value);
// Attendu: { editMode: 'editing', saveStatus: 'saved', toolbar: 'hidden' }

// Test du guard (bonus)
actor.send({ type: 'VIEW' });
actor.send({ type: 'MODIFY' });
console.log('MODIFY en viewing:', actor.getSnapshot().value);
// Attendu: saveStatus reste 'saved' car on n'est pas en editing
