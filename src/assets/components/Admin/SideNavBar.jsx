// SideNav.js
import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiInbox, HiShoppingBag, HiUser } from 'react-icons/hi';
import { useAuth } from '../../server/authUser'; // Importar el hook de autenticación

const SideNav = ({ isSidebarOpen, toggleSidebar }) => { 
  
  const { isAuthenticated, userData } = useAuth(); 

  return (
      <Sidebar collapsed={!isSidebarOpen} aria-label="Sidebar with multi-level dropdown example"  className={`mt-16 fixed inset-y-0 left-0 z-10 flex-shrink-0 text-white sidebar ${isSidebarOpen ? 'sidebar-enter' : 'sidebar-exit'} ${isAuthenticated ? '' : 'hidden'}`}       
      theme={{
        root: {
          inner: "h-full overflow-y-auto overflow-x-hidden rounded bg-white px-3 py-4 dark:bg-gray-900 sm:px-4 rounded p-3 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md"
        }
      }}>
        <Sidebar.Items >
            <Sidebar.ItemGroup>
            {isAuthenticated && userData.roles !=null? 
            (
              <div>
              <Sidebar.Item href="#" icon={HiChartPie}>
                Panel de Administración
              </Sidebar.Item>
              <Sidebar.Collapse icon={HiShoppingBag} label="Docentes">
                <Sidebar.Item href="/Admin/Teachers">Administrar Docentes</Sidebar.Item>
                <Sidebar.Item href="#">Shipping</Sidebar.Item>
              </Sidebar.Collapse>
              <Sidebar.Item href="/Admin/Students" icon={HiInbox}>
              Alumnos
              </Sidebar.Item>
              <Sidebar.Item href="/Admin/Materias" icon={HiUser}>
              Materias
              </Sidebar.Item>
              </div>
            )
            :
            (<div>
              <Sidebar.Collapse icon={HiShoppingBag} label="Materias Inscritas">
                <Sidebar.Item href="/Materias">Materias</Sidebar.Item>
                <Sidebar.Item href="/calendario-actividades">calendario de Actividades</Sidebar.Item>
              </Sidebar.Collapse>
            </div>
            )}
            </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
  );
};

export default SideNav;
