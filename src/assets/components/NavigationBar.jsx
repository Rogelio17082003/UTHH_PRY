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
import SideNav from './SideNavBar'
import  Components from './Components'
const {IconButton} = Components;

const NavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate(); 
  const { isAuthenticated, userData, logout } = useAuth(); // Obtén el estado de autenticación del contexto
  const [showMenu, setShowMenu] = useState(false);

  const profileImageUrl = isAuthenticated && userData?.vchFotoPerfil
    ? `https://robe.host8b.me/assets/imagenes/${userData.vchFotoPerfil}`
    : 'https://robe.host8b.me/assets/imagenes/userProfile.png'; // Enlace alternativo cuando vchFotoPerfil es null o usuario no está autenticado

// Usar profileImageUrl para el src de la imagen
<img src={profileImageUrl} alt="Perfil" />

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
          <div className="contents items-center">
            <div className={`nav__section nav__menu ${showMenu ? "show-menu" : ""}`} id="nav-menu">
              <ul className="nav__list">
                <li className="nav__item">
                  <NavLink to="/" className="nav__link" onClick={closeMenuOnMobile}>
                    Inicio
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="/news" className="nav__link" onClick={closeMenuOnMobile}>
                    Para Docentes
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="/about-us" className="nav__link" onClick={closeMenuOnMobile}>
                    Gamificación educativa
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="/favorite" className="nav__link" onClick={closeMenuOnMobile}>
                    Preguntas frecuentes
                  </NavLink>
                </li>
              </ul>

              <div className="nav__close" id="nav-close" onClick={toggleMenu}>
                <IoClose />
              </div>
            </div>
    
            <div className="nav__section nav__button">
              <IconButton
                className={`button ${showMenu ? "button-menu-active" : "button-menu-disable"}`}
                Icon={HiUserCircle} // Pasa el componente de ícono
                message="Iniciar Sesión"
                onClick={() => navigate('/inicio-sesion')}
              />
            </div>

            <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <IoMenu />
            </div>
          </div>
        )
    }
    </Navbar>

    <SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
    </>

  );
};

export default NavigationBar;
