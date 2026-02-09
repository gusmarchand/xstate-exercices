/**
 * EXERCICE 1 : Le lecteur audio
 *
 * Cree une machine a etats pour un lecteur audio avec 3 etats :
 *
 * ETATS :
 * - 'stopped' (etat initial)
 * - 'playing'
 * - 'paused'
 *
 * TRANSITIONS :
 * - Depuis 'stopped' : PLAY → 'playing'
 * - Depuis 'playing' : PAUSE → 'paused', STOP → 'stopped'
 * - Depuis 'paused' : PLAY → 'playing', STOP → 'stopped'
 *
 * REGLES :
 * - On ne peut pas PAUSE ou STOP depuis 'stopped'
 * - On ne peut pas PLAY depuis 'playing' (deja en lecture)
 * - On ne peut pas PAUSE depuis 'paused' (deja en pause)
 */

import { createMachine, createActor } from 'xstate';

const audioPlayerMachine = createMachine({
  id: 'audioPlayer',
  initial: 'stopped',
  states: {
    stopped: {
      on: {
        // TODO: PLAY → 'playing'
      }
    },
    playing: {
      on: {
        // TODO: PAUSE → 'paused'
        // TODO: STOP → 'stopped'
      }
    },
    paused: {
      on: {
        // TODO: PLAY → 'playing'
        // TODO: STOP → 'stopped'
      }
    }
  }
});

// === TESTS ===

const actor = createActor(audioPlayerMachine);
actor.start();

console.log('Etat initial:', actor.getSnapshot().value);
// Attendu: 'stopped'

actor.send({ type: 'PLAY' });
console.log('Apres PLAY:', actor.getSnapshot().value);
// Attendu: 'playing'

actor.send({ type: 'PAUSE' });
console.log('Apres PAUSE:', actor.getSnapshot().value);
// Attendu: 'paused'

actor.send({ type: 'PLAY' });
console.log('Apres PLAY:', actor.getSnapshot().value);
// Attendu: 'playing'

actor.send({ type: 'STOP' });
console.log('Apres STOP:', actor.getSnapshot().value);
// Attendu: 'stopped'

actor.send({ type: 'PAUSE' });
console.log('PAUSE depuis stopped:', actor.getSnapshot().value);
// Attendu: 'stopped' (PAUSE ignore depuis stopped)
