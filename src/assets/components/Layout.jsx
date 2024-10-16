// Layout.js
import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import FooterSection from './FooterSection';
import BreadcrumbNav from './Breadcrumb';
import SideNav from './SideNavBar';
import { useAuth } from '../server/authUser'; // Importar el hook de autenticación

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación del contexto
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex">
      <SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className={`flex-grow bg-gray-100 ${isAuthenticated ? (isSidebarOpen ? 'ml-64' : 'ml-12') : ''}`}>
      <NavigationBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
        <section className='m-4'>
          <main className="flex-grow mx-auto px-4 min-h-screen">
            <BreadcrumbNav />
                {children}
          </main>
          <FooterSection />
        </section>
      </div>
    </div>
  );
}

export default Layout;
