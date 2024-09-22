import React, { useEffect } from 'react';
import { useAuth } from '../src/assets/server/authUser.jsx'; // Importa el hook de autenticación
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './assets/pages/notificaciones/firebase.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationHandler = () => {
  const { userData, isAuthenticated } = useAuth(); // Obtén el estado de autenticación del contexto

  const requestPermission = async () => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../firebase-messaging-sw.js')
          .then(function(registration) {
            console.log('Service Worker registrado con éxito:', registration);
            
            console.log('Registration successful, scope is:', registration.scope);
          }).catch(function(err) {
            console.log('Service worker registration failed, error:', err);
          });
      }
      if (isAuthenticated) {

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: 'BMEGW6-IazTd7efdm7EibTQ0BzKZWKIMe_xBwCwQTdmzW-tKLYokd897CcONFbs6Dro2-w8wRRciCWv-YnVu0KM' });
          if (token) {
            console.log("nuevo",token)
            try {
              const response = await fetch('https://robe.host8b.me/WebServices/enviarToken.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  vchMatricula: userData.vchMatricula,
                  tokenFirebase: token,
                }),
              });

              const result = await response.json();

              if (result.done) {
                console.log(result)
                localStorage.setItem('authTokenFirebase', token);
              }
            } catch (error) {
              console.error('Error 500', error);
              setTimeout(() => {
                alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
              }, 2000);
            }
          }
        } else {
          console.log('Permiso de notificación denegado.');
        }
      }
    } catch (error) {
      console.error('Error al solicitar permiso de notificación:', error);
    }
  };

  useEffect(() => {
    requestPermission();
    onMessage(messaging, message => {
      console.log('Mensaje recibido en primer plano:', message);
      toast(
        <div className="flex flex-col gap-1">
          <strong className="text-lg font-semibold text-gray-800">{message.notification.title}</strong>
          <span className="text-sm text-gray-600">{message.notification.body}</span>
        </div>,
        {
          icon: "🔔", // Puedes agregar un ícono de notificación
        }
      );     
    });
  }, []);

  return <ToastContainer />;
};

export default NotificationHandler;
