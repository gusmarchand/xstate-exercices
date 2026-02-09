/**
 * PROJET FINAL : Application de Chat
 *
 * Complete cette machine en utilisant tous les concepts appris.
 * Reference-toi au README.md pour les specifications completes.
 */

import {
  createMachine,
  createActor,
  assign,
  fromPromise,
  fromCallback
} from 'xstate';

// === TYPES ===

type Channel = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
};

// === SIMULATED API ===

const simulateWebSocket = (userId: string) => {
  return {
    connect: () =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) resolve();
          else reject(new Error('Connection failed'));
        }, 1000);
      }),
    disconnect: () => Promise.resolve()
  };
};

const fetchChannels = async (): Promise<Channel[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return [
    { id: '1', name: 'general' },
    { id: '2', name: 'random' },
    { id: '3', name: 'help' }
  ];
};

const sendMessageApi = async (
  channelId: string,
  text: string
): Promise<Message> => {
  await new Promise((r) => setTimeout(r, 200));
  return {
    id: Date.now().toString(),
    channelId,
    userId: 'current-user',
    username: 'You',
    text,
    timestamp: Date.now()
  };
};

// === MACHINE ===

const chatMachine = createMachine(
  {
    id: 'chat',
    type: 'parallel',
    context: {
      userId: null as string | null,
      username: '',
      connectionAttempts: 0,
      currentChannel: null as Channel | null,
      channels: [] as Channel[],
      messages: [] as Message[],
      error: null as string | null
    },
    states: {
      // === REGION : CONNECTION ===
      connection: {
        initial: 'disconnected',
        states: {
          disconnected: {
            entry: assign({
              connectionAttempts: 0,
              error: null
            }),
            on: {
              // TODO: CONNECT → connecting
              // Sauvegarde userId et username depuis l'event
            }
          },

          connecting: {
            entry: assign({
              connectionAttempts: ({ context }) => context.connectionAttempts + 1
            }),
            invoke: {
              id: 'connect',
              // TODO: Simule la connexion WebSocket
              // Utilise fromPromise avec simulateWebSocket
              src: fromPromise(async ({ input }) => {
                // A completer
              }),
              input: ({ context }) => ({ userId: context.userId }),
              onDone: {
                // TODO: → connected.lobby
                // Charge aussi les channels
              },
              onError: [
                {
                  // TODO: Si canReconnect → retenter apres delai
                  guard: 'canReconnect',
                  target: 'reconnecting'
                },
                {
                  // TODO: Sinon → disconnected avec erreur
                  target: 'disconnected',
                  actions: assign({
                    error: 'Failed to connect after multiple attempts'
                  })
                }
              ]
            }
          },

          reconnecting: {
            // TODO: Attend 2 secondes puis retente
            // Utilise after: { 2000: 'connecting' }
          },

          connected: {
            initial: 'lobby',
            on: {
              // TODO: DISCONNECT → disconnected
              // TODO: CONNECTION_LOST → reconnecting (si canReconnect)
            },
            states: {
              lobby: {
                // TODO: Charge les channels a l'entree
                on: {
                  // TODO: JOIN_CHANNEL → inChannel
                  // Sauvegarde le channel dans currentChannel
                }
              },

              inChannel: {
                on: {
                  // TODO: LEAVE_CHANNEL → lobby
                  // TODO: SEND_MESSAGE → invoque sendMessageApi
                  // TODO: RECEIVE_MESSAGE → ajoute le message a la liste
                }
              }
            }
          }
        }
      },

      // === REGION : UI ===
      ui: {
        type: 'parallel',
        states: {
          sidebar: {
            initial: 'visible',
            states: {
              visible: {
                on: {
                  // TODO: TOGGLE_SIDEBAR → hidden
                }
              },
              hidden: {
                on: {
                  // TODO: TOGGLE_SIDEBAR → visible
                }
              }
            }
          },

          theme: {
            initial: 'light',
            states: {
              light: {
                on: {
                  // TODO: TOGGLE_DARK_MODE → dark
                }
              },
              dark: {
                on: {
                  // TODO: TOGGLE_DARK_MODE → light
                }
              }
            }
          }
        }
      }
    }
  },
  {
    guards: {
      canReconnect: ({ context }) => {
        // TODO: Moins de 3 tentatives
        return false;
      },
      isInChannel: ({ context }) => {
        // TODO: currentChannel n'est pas null
        return false;
      },
      hasValidMessage: ({ event }) => {
        // TODO: event.text est non vide
        return false;
      }
    }
  }
);

// === TESTS ===

const actor = createActor(chatMachine);

actor.subscribe((snapshot) => {
  console.log('State:', JSON.stringify(snapshot.value, null, 2));
});

actor.start();

console.log('\n=== Test: Connect ===');
actor.send({ type: 'CONNECT', userId: 'user-1', username: 'Alice' });

// Attend la connexion et les channels
setTimeout(() => {
  console.log('\n=== Context apres connexion ===');
  console.log('Channels:', actor.getSnapshot().context.channels);

  console.log('\n=== Test: Join Channel ===');
  actor.send({ type: 'JOIN_CHANNEL', channel: { id: '1', name: 'general' } });

  setTimeout(() => {
    console.log('\n=== Test: Toggle UI ===');
    actor.send({ type: 'TOGGLE_SIDEBAR' });
    actor.send({ type: 'TOGGLE_DARK_MODE' });
    console.log('UI State:', actor.getSnapshot().value);
  }, 500);
}, 2000);
