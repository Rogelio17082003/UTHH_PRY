import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './assets/server/authUser'; // Importa el AuthProvider
import NotificationHandler from './NotificationHandler'; // Importa el nuevo componente NotificationHandler

/*
if (process.env.NODE_ENV === 'production') {

  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}*/

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js', { scope: '/pwa/' })
    .then(function(registration) {
      console.log('Service Worker PWA registrado con éxito:', registration);

      console.log('Service Worker registered with scope PWA:', registration.scope);
    })
    .catch(function(error) {
      console.log('Error al registrar el service de la PWA:', error);
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationHandler />
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

//serviceWorker.register();
