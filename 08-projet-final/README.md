# Module 8 - Projet Final : Application de Chat

## Objectif

Mettre en pratique tous les concepts appris en créant une machine complexe pour une application de chat.

## Ce que tu vas utiliser

- États imbriqués (connexion > authentifié > channels)
- États parallèles (connexion + UI)
- Guards (validation, permissions)
- Actions (side effects, assign)
- Services (WebSocket, API calls)
- Intégration React

## Spécifications

### Architecture de la machine

```
┌─────────────────────────────────────────────────────────────────┐
│                          chatApp                                 │
│  type: parallel                                                  │
│                                                                  │
│  ┌─────────────────────────────────────────┐                    │
│  │            connection                    │                    │
│  │  ┌───────────┐    ┌──────────────────┐  │                    │
│  │  │disconnected│───▶│   connecting    │  │                    │
│  │  └───────────┘    └────────┬─────────┘  │                    │
│  │        ▲                   │             │                    │
│  │        │          ┌────────▼─────────┐  │                    │
│  │        └──────────│    connected     │  │                    │
│  │                   │  ┌─────────────┐ │  │                    │
│  │                   │  │   lobby     │ │  │                    │
│  │                   │  └──────┬──────┘ │  │                    │
│  │                   │         │        │  │                    │
│  │                   │  ┌──────▼──────┐ │  │                    │
│  │                   │  │  inChannel  │ │  │                    │
│  │                   │  └─────────────┘ │  │                    │
│  │                   └──────────────────┘  │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                  │
│  ┌─────────────────────────────────────────┐                    │
│  │               ui                         │                    │
│  │  ┌─────────┐  ┌──────────┐              │                    │
│  │  │ sidebar │  │ darkMode │              │                    │
│  │  │ visible │  │  light   │              │                    │
│  │  │ hidden  │  │  dark    │              │                    │
│  │  └─────────┘  └──────────┘              │                    │
│  └─────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### Contexte

```typescript
context: {
  // User
  userId: null,
  username: '',

  // Connection
  connectionAttempts: 0,

  // Chat
  currentChannel: null,
  channels: [],
  messages: [],

  // Errors
  error: null
}
```

### Événements principaux

| Événement | Description |
|-----------|-------------|
| CONNECT | Tenter de se connecter |
| DISCONNECT | Se déconnecter |
| CONNECTION_LOST | Connexion perdue (automatique) |
| JOIN_CHANNEL | Rejoindre un channel |
| LEAVE_CHANNEL | Quitter le channel actuel |
| SEND_MESSAGE | Envoyer un message |
| RECEIVE_MESSAGE | Recevoir un message (du serveur) |
| TOGGLE_SIDEBAR | Afficher/masquer la sidebar |
| TOGGLE_DARK_MODE | Changer le thème |

### Guards

- `canReconnect` : moins de 3 tentatives
- `isInChannel` : vérifie qu'on est dans un channel
- `hasValidMessage` : message non vide

### Services à implémenter

1. **WebSocket connection** : `fromCallback` qui simule une connexion WebSocket
2. **Fetch channels** : `fromPromise` pour charger la liste des channels
3. **Send message API** : `fromPromise` pour envoyer un message

## Étapes suggérées

### Étape 1 : Structure de base
Crée la machine avec les états parallèles `connection` et `ui`.

### Étape 2 : Gestion de connexion
Implémente le flux `disconnected → connecting → connected`.

### Étape 3 : Navigation dans les channels
Ajoute les sous-états `lobby` et `inChannel`.

### Étape 4 : Messages
Gère l'envoi et la réception de messages.

### Étape 5 : UI
Implémente les états parallèles pour sidebar et dark mode.

### Étape 6 : React
Crée les composants React qui utilisent la machine.

## Fichiers

- `exercice.ts` : Machine à compléter
- `solution.ts` : Solution complète de la machine
- `components/` : Composants React (solution)

## Conseils

1. **Commence petit** : fais fonctionner la connexion d'abord
2. **Teste souvent** : utilise `createActor` pour tester ta machine
3. **Visualise** : utilise [Stately Studio](https://stately.ai/viz) pour voir ta machine
4. **Itère** : n'essaie pas de tout faire d'un coup

## Ressources

- [Documentation XState v5](https://stately.ai/docs/xstate)
- [Stately Studio](https://stately.ai/studio) - Éditeur visuel
- [@xstate/react docs](https://stately.ai/docs/xstate-react)
