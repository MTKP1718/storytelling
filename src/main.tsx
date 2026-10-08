import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeMoodProvider } from './context/ThemeMoodContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeMoodProvider>
      <App />
    </ThemeMoodProvider>
  </StrictMode>,
)

