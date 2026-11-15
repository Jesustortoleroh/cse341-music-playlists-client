# 🎵 Vibe Beat - Client (Frontend)

This is the **frontend client** for the Vibe Beat API. It is a React application built with TypeScript and Vite, designed to provide a clean, modern interface for managing music playlists.

## 📋 Description

The client connects to the backend API to perform full CRUD operations (Create, Read, Update, Delete) on music playlists. It features:

- **OAuth 2.0 Authentication:** Login with GitHub and Google.
- **Modern UI:** Dark mode, responsive grid, glassmorphism effects, and interactive modals.
- **State Management:** React 19 hooks (`useState`, `useEffect`, `useCallback`) for managing app state.
- **Accessibility (a11y):** Keyboard navigation, ARIA attributes, and focus management for modals.
- **Cross-Origin Communication:** Handles cookies and CORS for secure communication with the backend.

## 🚀 Technologies

- **React 19** (with Hooks)
- **TypeScript**
- **Vite 8** (Build tool)
- **CSS3** (Custom styling, no external UI libraries)
- **Native Fetch API** (Centralized in a custom service layer)
- **Prettier** & **ESLint** (for code quality and formatting)

## 🏗️ Project Structure

- `src/App.tsx`: Main component managing the overall layout, state, and data fetching logic.
- `src/App.css`: Custom styles for the entire application (dark theme, responsive design, animations).
- `src/main.tsx`: Entry point of the React application.
- `src/types/index.ts`: TypeScript interfaces shared across the app.
- `src/services/api.ts`: Centralized service for all HTTP requests to the backend, handling error parsing and base URL logic.
- `src/components/`: Reusable UI components:
  - `AuthModal.tsx`: Login and Registration modal with form validation.
  - `PlaylistCard.tsx`: Displays a playlist with options to edit, delete, and play songs.
  - `PlaylistForm.tsx`: Form to create new playlists with an interactive track builder.
  - `CustomSelect.tsx`: Accessible, custom dropdown component.
  - `AudioPlayer.tsx`: Floating simulated audio player.
  - `Notifications.tsx`: Toast notifications for user feedback.
- `vite.config.ts`: Vite configuration (including the proxy for local development).
- `.env`: Environment variables (not pushed to GitHub).

## 🛠️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jesustortoleroh/vibe-beat-client.git
   cd vibe-beat-client