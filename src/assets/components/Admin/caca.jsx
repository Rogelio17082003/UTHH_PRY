import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sidebar, Avatar, Dropdown, Navbar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from 'react-icons/hi';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación

const SideNav = ({ isSidebarOpen, toggleSidebar }) => { 
  
  const { isAuthenticated } = useAuth(); 

  return (
    <div className={`sidebar ${isSidebarOpen ? 'sidebar-enter' : 'sidebar-exit'} ${isAuthenticated ? '' : 'hidden'}`}>
     <Sidebar aria-label="Sidebar with multi-level dropdown example">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
                <Sidebar.Item href="#">Products</Sidebar.Item>
                <Sidebar.Item href="#">Sales</Sidebar.Item>
                <Sidebar.Item href="#">Refunds</Sidebar.Item>
                <Sidebar.Item href="#">Shipping</Sidebar.Item>
              </Sidebar.Collapse>
              <Sidebar.Item href="#" icon={HiInbox}>
                Inbox
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUser}>
                Users
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
    </div>
  );
};

export default SideNav;