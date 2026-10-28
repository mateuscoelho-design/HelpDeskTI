import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

//Inicializar a aplicação React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)