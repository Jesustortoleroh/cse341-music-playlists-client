# 🎵 Music Playlists - Client (Frontend)

This is the **frontend client** for the Music Playlists API. It is a React application built with TypeScript and Vite, designed to provide a clean, modern interface for managing music playlists.

## 📋 Description

The client connects to the backend API to perform full CRUD operations (Create, Read, Update, Delete) on music playlists. It features:
- **OAuth 2.0 Authentication:** Login with GitHub and Google.
- **Modern UI:** Dark mode, responsive grid, and interactive modals.
- **State Management:** React hooks (`useState`, `useEffect`) for managing app state.
- **Cross-Origin Communication:** Handles cookies and CORS for secure communication with the backend on Render.

## 🚀 Technologies

- **React** (with Hooks)
- **TypeScript**
- **Vite** (Build tool)
- **CSS3** (Custom styling, no external UI libraries)
- **Fetch API** (for HTTP requests)

## 🏗️ Project Structure

- `src/App.tsx`: Main component containing the logic for authentication, CRUD operations, and UI rendering.
- `src/App.css`: Custom styles for the entire application (dark theme, modals, cards, etc.).
- `src/main.tsx`: Entry point of the React application.
- `vite.config.ts`: Vite configuration (including the proxy for local development).
- `.env`: Environment variables (not pushed to GitHub).

## 🛠️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Jesustortoleroh/cse341-music-playlists-client.git
   cd cse341-music-playlists-client
