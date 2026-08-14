import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { AppProviders } from "./contexts/AppProviders";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter /*hace que nuestra SPA pueda asociar distintas URLs a distintos componentes sin hacer una navegación tradicional completa del navegador.*/> 
    <AppProviders>
    <App />
    </AppProviders> 
    </BrowserRouter>
  </StrictMode>,
)
