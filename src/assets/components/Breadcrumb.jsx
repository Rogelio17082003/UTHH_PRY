import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

const BreadcrumbNav = () => {
    const location = useLocation();
    const { id } = useParams();

    const getPageName = () => {
        const path = location.pathname;
        switch (path) {
          case '/':
            return '';
            
            case '/login':
                return 'Inicio de Sesión';
                case '/register':
                    return 'Registro';
          case '/ResultadosCalificaciones':
            return 'Resultados de Calificaciones';
            case '/restablecer-contrasena':
              return 'restablecer-contrasena';
              case '/BusquedaAvanzada':
                return 'BusquedaAvanzada';
                case '/Terminos-Condiciones':
                  return 'Terminos-Condiciones';            
                case '/recover-password':
                  return 'Recuperar Contraseña';
          case `/ResultadosCalificaciones/detalle/${id}`: // Reemplaza 'id' con la lógica adecuada para extraer el ID
          return `Resultados de Calificaciones / Detalle de Calificación / ${id}`;
          default:
            return 'Error 404';
        }
      };
    return (
    <div className='container mx-auto pt-20 pb-6'>

        <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="#" icon={HiHome}>
            Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">{getPageName()}</Breadcrumb.Item>
        </Breadcrumb>
    </div>
    );
}

export default BreadcrumbNav;

