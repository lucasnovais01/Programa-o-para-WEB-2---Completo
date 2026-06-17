import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ResourcesProviders } from './providers/ResourcesProviders.tsx';

// OBS: o App agora já cria o Router (createBrowserRouter + RouterProvider).
// Antes o projeto envolvia o App com <BrowserRouter> aqui. Isso gerou
// um erro em tempo de execução: "You cannot render a <Router> inside another <Router>".
// Em vez de remover o código original sem aviso, comentei a importação e o
// wrapper abaixo e deixei uma explicação. Se preferir usar o BrowserRouter
// aqui, o App não deve usar RouterProvider/createBrowserRouter.
// import { BrowserRouter } from 'react-router-dom'  // IMPORTA AQUI

import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? ''; // Configure axios base URL from Vite env variable (set VITE_API_URL in .env)

// CSS
import './assets/css/0-style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*
      Como estgava antes, mas causava erro de router aninhado:

      <BrowserRouter>   ENVOLVE O APP
        <App />
      </BrowserRouter>
    */}
    {/*
      Renderiza o App diretamente. O App usa RouterProvider internamente
      (createBrowserRouter), portanto NÃO devemos envolver aqui com outro
      <BrowserRouter> para evitar routers aninhados.
    */}
    <ResourcesProviders>
      <App />
    </ResourcesProviders>
  </React.StrictMode>,
)