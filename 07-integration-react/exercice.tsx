/**
 * EXERCICE 7 : Formulaire de login avec React
 *
 * Cree un formulaire de login complet avec :
 * 1. Une machine XState pour gerer l'etat
 * 2. Un composant React qui utilise cette machine
 *
 * ETATS DE LA MACHINE :
 * - 'idle' : formulaire vide, en attente
 * - 'editing' : l'utilisateur saisit ses donnees
 * - 'submitting' : soumission en cours
 * - 'success' : connexion reussie
 * - 'error' : erreur de connexion
 *
 * CONTEXTE :
 * - email: ''
 * - password: ''
 * - errorMessage: null
 *
 * EVENEMENTS :
 * - UPDATE_EMAIL : { value: string }
 * - UPDATE_PASSWORD : { value: string }
 * - SUBMIT : soumet le formulaire
 * - RETRY : depuis error, retour a editing
 *
 * GUARDS :
 * - isFormValid : email contient @ ET password >= 8 caracteres
 *
 * SERVICE :
 * - Simule un appel API de login (utilise loginApi ci-dessous)
 */

import { createMachine, assign, fromPromise } from 'xstate';
import { useMachine } from '@xstate/react';

// API simulee
const loginApi = async (email: string, password: string): Promise<{ token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (email === 'error@test.com') {
    throw new Error('Invalid credentials');
  }
  return { token: 'fake-jwt-token' };
};

// === MACHINE ===

const loginMachine = createMachine(
  {
    id: 'login',
    initial: 'idle',
    context: {
      email: '',
      password: '',
      errorMessage: null as string | null
    },
    states: {
      idle: {
        on: {
          // TODO: UPDATE_EMAIL et UPDATE_PASSWORD → editing
        }
      },

      editing: {
        on: {
          // TODO: UPDATE_EMAIL - met a jour email dans le contexte
          // TODO: UPDATE_PASSWORD - met a jour password dans le contexte
          // TODO: SUBMIT - si formulaire valide → submitting
          //       Utilise le guard 'isFormValid'
        }
      },

      submitting: {
        invoke: {
          id: 'login',
          // TODO: Utilise fromPromise avec loginApi
          // N'oublie pas de passer email et password via input
          src: fromPromise(async ({ input }) => {
            // A completer
          }),
          input: ({ context }) => ({
            /* A completer */
          }),
          onDone: {
            // TODO: → success
          },
          onError: {
            // TODO: → error, sauvegarde errorMessage
          }
        }
      },

      success: {
        entry: () => console.log('Login successful!')
        // Etat final - pas de transitions sortantes
      },

      error: {
        on: {
          // TODO: RETRY → editing (garde les donnees saisies)
        }
      }
    }
  },
  {
    guards: {
      isFormValid: ({ context }) => {
        // TODO: Implemente la validation
        return false;
      }
    }
  }
);

// === COMPOSANT REACT ===

export function LoginForm() {
  // TODO: Utilise useMachine pour connecter la machine

  // INDICE: const [snapshot, send] = useMachine(loginMachine);

  return (
    <div className="login-form">
      <h2>Login</h2>

      {/* TODO: Affiche un message different selon l'etat */}

      {/* TODO: Formulaire avec inputs email/password */}
      {/* - Utilise snapshot.context.email et snapshot.context.password comme values */}
      {/* - Envoie UPDATE_EMAIL et UPDATE_PASSWORD sur onChange */}

      {/* TODO: Bouton submit */}
      {/* - Desactive si en submitting */}
      {/* - Texte different selon l'etat (Submit / Submitting...) */}

      {/* TODO: Affiche l'erreur si en etat 'error' */}
      {/* - Ajoute un bouton Retry */}

      {/* TODO: Affiche un message de succes si en etat 'success' */}
    </div>
  );
}

// === VERSION SQUELETTE (pour t'aider a demarrer) ===

export function LoginFormSkeleton() {
  // Decommente et complete :
  // const [snapshot, send] = useMachine(loginMachine);

  // const isSubmitting = snapshot.matches('submitting');
  // const isError = snapshot.matches('error');
  // const isSuccess = snapshot.matches('success');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // send({ type: 'SUBMIT' });
      }}
    >
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          // value={snapshot.context.email}
          // onChange={(e) => send({ type: 'UPDATE_EMAIL', value: e.target.value })}
          // disabled={isSubmitting || isSuccess}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          // value={snapshot.context.password}
          // onChange={(e) => send({ type: 'UPDATE_PASSWORD', value: e.target.value })}
          // disabled={isSubmitting || isSuccess}
        />
      </div>

      <button
        type="submit"
        // disabled={isSubmitting || isSuccess}
      >
        {/* {isSubmitting ? 'Logging in...' : 'Login'} */}
        Login
      </button>

      {/* {isError && (
        <div className="error">
          <p>{snapshot.context.errorMessage}</p>
          <button type="button" onClick={() => send({ type: 'RETRY' })}>
            Try again
          </button>
        </div>
      )} */}

      {/* {isSuccess && <p className="success">Welcome!</p>} */}
    </form>
  );
}
