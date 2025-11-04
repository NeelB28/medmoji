import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Removed default Vite styles to avoid layout/color conflicts
// import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
