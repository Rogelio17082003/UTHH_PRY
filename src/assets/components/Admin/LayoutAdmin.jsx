// Layout.js
import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import FooterSection from './FooterSection';
import BreadcrumbNav from './Breadcrumb';
import SideNav from '../components/Admin/SideNavBar';
import { useForm } from 'react-hook-form';
import { useAuth } from '../server/authUser'; // Importar el hook de autenticación
import  Components from '../components/Components'
const { LoadingButton, CustomInput, CustomInputPassword, CustomRepeatPassword} = Components;

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación del contexto
  
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  return (
    <CustomInput
    label="Matrícula"
    name="matriculaAlum"
    pattern={/^\d+$/}
    errorMessage="Solo números y sin espacios"
    errors={errors}
    register={register}
    trigger={trigger}
/>
  );
}

export default Layout;
