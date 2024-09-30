import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { HiUserCircle } from 'react-icons/hi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Button, Navbar, Avatar, Dropdown } from 'flowbite-react';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../server/authUser'; // Importa el hook de autenticación
import secondaryLogo from '../images/secondary-logo.png'
import logoPwa from '../images/logo-pwa.png'
import SideNav from './SideNavBar'
import  Components from './Components'
const {LoadingButton} = Components;

const NavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate(); 
  const { isAuthenticated, userData, logout } = useAuth(); // Obtén el estado de autenticación del contexto
  const [showMenu, setShowMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false); // Muestra el snackbar si la app es instalable
  const [isInstallable, setIsInstallable] = useState(false); // Estado para saber si la PWA es instalable

    // Función para verificar si la PWA está instalada
    const checkIfAppIsInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches;
    };
  
    useEffect(() => {
      // Verifica si la PWA ya está instalada al cargar la página
      if (!checkIfAppIsInstalled() && isInstallable) {
        setShowSnackbar(true);
      }
  
      // Escucha el evento `appinstalled`
      window.addEventListener('appinstalled', () => {
        console.log('PWA fue instalada');
        setShowSnackbar(false); // Oculta el Snackbar una vez instalada
      });
  
      // Limpia el event listener cuando el componente se desmonta
      return () => {
        window.removeEventListener('appinstalled', () => {
          setShowSnackbar(false);
        });
      };
    }, [isInstallable]);
  
    const handleCloseSnackbar = () => {
      setShowSnackbar(false); // Cierra el Snackbar cuando se hace clic en la "X"
    };
  
  const profileImageUrl = isAuthenticated && userData?.vchFotoPerfil
    ? `https://robe.host8b.me/assets/imagenes/${userData.vchFotoPerfil}`
    : 'https://robe.host8b.me/assets/imagenes/userProfile.png'; // Enlace alternativo cuando vchFotoPerfil es null o usuario no está autenticado

// Usar profileImageUrl para el src de la imagen
<img src={profileImageUrl} alt="Perfil" />



useEffect(() => {
  const handler = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setIsInstallable(true);
  };

  window.addEventListener('beforeinstallprompt', handler);

  return () => {
    window.removeEventListener('beforeinstallprompt', handler);
  };
}, []);

const handleInstallClick = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  }
};

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (showMenu) {
        // Cierra el menú si está abierto
        setShowMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Limpia el event listener cuando el componente se desmonta
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMenu]);

  return (
    <>
    <div>
      {showSnackbar && (
        <div  style={{ zIndex: 'var(--z-fixed)', '--z-fixed': 100 }} className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 flex items-center justify-between shadow-lg rounded-xl w-full max-w-md">
          <div className="flex items-center">
            <img src={logoPwa} alt="Logo UTHH Virtual" className="w-12 h-12 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">App de UTHH Virtual</h2>
              <p className="text-gray-600">Descarga la app para un acceso rápido</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LoadingButton 
            normalLabel="Instalar App" 
            className="w-auto h-auto"
            onClick={handleInstallClick} 
          />
            <button
              onClick={handleCloseSnackbar}
              className="text-gray-400 hover:text-gray-700 transition duration-300"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
    <Navbar fluid rounded className="p-3 bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 header">
      <div className="nav__section flex">
        <div className={`nav__toggle  ${isAuthenticated ? "block md:block mr-2" : "hidden "}`} id="nav-toggle" onClick={toggleSidebar}>
          <IoMenu />
        </div>
        <Navbar.Brand as={NavLink} to="/">
          <img className="h-8 mr-2" src={secondaryLogo} alt="" />
          UTHH Virtual
        </Navbar.Brand>
      </div>
      {isAuthenticated ? 
        (
        <div className="flex items-center gap-4 md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={profileImageUrl}
                rounded
              />
            }
          >
            <Dropdown.Item href='/mi-perfil'>
              <FaUser className="mr-2" />
              Mi Perfil
            </Dropdown.Item>
            <Dropdown.Item onClick={logout}>
              <FaSignOutAlt className="mr-2" />
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown>

          <div className="flex flex-col text-right">
          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {userData.vchNombre.toLowerCase()} {userData.vchAPaterno.toLowerCase()} {userData.vchAMaterno.toLowerCase()}
          </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{userData.vchNombreRol}</span>
          </div>
        </div>

        )
        :
        (
          <LoadingButton 
            Icon={HiUserCircle} 
            normalLabel="Iniciar Sesión" 
            className="w-auto h-auto"
            onClick={() => navigate('/inicio-sesion')} 
          />
        )
    }
    </Navbar>

    <SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
    </>

  );
};

export default NavigationBar;
