/**
 * EXERCICE 4 : Processus d'inscription multi-etapes
 *
 * Cree une machine pour un formulaire d'inscription en 3 etapes :
 *
 * STRUCTURE :
 *
 * ┌─────────────────────────────────────────────────────┐
 * │                    registration                      │
 * │  ┌──────────┐   ┌──────────┐   ┌───────────────┐   │
 * │  │ step1    │ → │ step2    │ → │ step3         │   │
 * │  │ (email)  │   │ (profile)│   │ (confirmation)│   │
 * │  └──────────┘   └──────────┘   └───────────────┘   │
 * │                                                      │
 * │  [CANCEL] ────────────────────────────────────────────→ cancelled
 * └─────────────────────────────────────────────────────┘
 *                          │
 *                          │ onDone (step3 = final)
 *                          ▼
 *                    ┌──────────┐
 *                    │ complete │
 *                    └──────────┘
 *
 * CONTEXTE :
 * - email: ''
 * - username: ''
 * - bio: ''
 *
 * EVENEMENTS :
 * - NEXT : passe a l'etape suivante (avec donnees dans l'event)
 * - BACK : revient a l'etape precedente
 * - CANCEL : annule depuis n'importe quelle etape (transition sur le parent!)
 *
 * LOGIQUE :
 * - step1: collecte email, NEXT → step2
 * - step2: collecte username + bio, NEXT → step3, BACK → step1
 * - step3: etat final → declenche onDone vers 'complete'
 * - CANCEL depuis registration → cancelled
 */

import { createMachine, createActor, assign } from 'xstate';

const registrationMachine = createMachine({
  id: 'registration',
  initial: 'registration',
  context: {
    email: '',
    username: '',
    bio: ''
  },
  states: {
    registration: {
      // TODO: Ajoute la transition CANCEL vers 'cancelled'
      // Cette transition doit etre accessible depuis TOUS les sous-etats

      initial: 'step1',
      // TODO: Ajoute onDone pour aller vers 'complete' quand step3 est final

      states: {
        step1: {
          on: {
            // TODO: NEXT avec action pour sauvegarder email
            // event.email contient la valeur
          }
        },
        step2: {
          on: {
            // TODO: NEXT avec action pour sauvegarder username et bio
            // TODO: BACK pour revenir a step1
          }
        },
        step3: {
          // TODO: Marque cet etat comme 'final'
          // Quand on arrive ici, ca declenche onDone du parent
          entry: ({ context }) => {
            console.log('Recapitulatif:');
            console.log('- Email:', context.email);
            console.log('- Username:', context.username);
            console.log('- Bio:', context.bio);
          }
        }
      }
    },
    complete: {
      entry: () => console.log('Inscription terminee!')
    },
    cancelled: {
      entry: () => console.log('Inscription annulee.')
    }
  }
});

// === TESTS ===

console.log('=== Test 1: Parcours complet ===');
const actor1 = createActor(registrationMachine);
actor1.start();

console.log('Initial:', actor1.getSnapshot().value);
// Attendu: { registration: 'step1' }

actor1.send({ type: 'NEXT', email: 'test@example.com' });
console.log('Apres step1:', actor1.getSnapshot().value);
// Attendu: { registration: 'step2' }

actor1.send({ type: 'BACK' });
console.log('Apres BACK:', actor1.getSnapshot().value);
// Attendu: { registration: 'step1' }

actor1.send({ type: 'NEXT', email: 'test@example.com' });
actor1.send({ type: 'NEXT', username: 'johndoe', bio: 'Hello world' });
console.log('Apres step2:', actor1.getSnapshot().value);
// Attendu: 'complete' (step3 est final, onDone se declenche immediatement)

console.log('\n=== Test 2: Annulation ===');
const actor2 = createActor(registrationMachine);
actor2.start();

actor2.send({ type: 'NEXT', email: 'test@example.com' });
actor2.send({ type: 'CANCEL' });
console.log('Apres CANCEL:', actor2.getSnapshot().value);
// Attendu: 'cancelled'
