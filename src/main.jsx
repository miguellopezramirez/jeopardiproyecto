import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GameProvider } from './backend/GameContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GameProvider>
    <App />
  </GameProvider>,
)
