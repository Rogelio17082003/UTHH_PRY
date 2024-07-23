import React, { useState } from 'react';
import { useAuth } from '../server/authUser'; // Importa el hook de autenticación
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { BsCalendar } from 'react-icons/bs';
import { RiUserSettingsLine, RiAccountPinBoxLine } from 'react-icons/ri';
import { FaUserTag, FaEdit, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Alert, Card, Checkbox, Label, Button } from 'flowbite-react';
import  Components from '../components/Components'
import AlexaLogo from '../images/alexa-logo.png';

const {TitlePage, TitleSection, LoadingButton, CustomInput, Paragraphs, CustomInputPassword, CustomRepeatPassword} = Components;
const PasswordValidationItem = ({ isValid, text }) => (
  <li className="flex items-center mb-1">
    {isValid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
    {text}
  </li>
);
const PerfilUsuario = () => {
  const { isAuthenticated, userData, logout } = useAuth(); // Obtén el estado de autenticación del contexto
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+00 123 456 789 / +12 345 678");
  const [editing, setEditing] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleEdit = () => {
    setEditing(true);
    setNewPhoneNumber(phoneNumber);
  };

  const handleSave = () => {
    setEditing(false);
    setPhoneNumber(newPhoneNumber);
  };

  const handleChange = (e) => {
    setNewPhoneNumber(e.target.value);
  };


  const validationItems = [
    { key: 'length', text: 'Mínimo 8 caracteres' },
    { key: 'lowercase', text: 'Al menos una letra minúscula' },
    { key: 'uppercase', text: 'Al menos una letra mayúscula' },
    { key: 'digit', text: 'Al menos un dígito' },
    { key: 'specialChar', text: 'Al menos 1 caracter especial' },
    { key: 'noSpace', text: 'No espacios en blanco' },
  ];

  const getPasswordValidationIcon = (key) => {
    const password = watch('password');

    switch (key) {
        case 'length':
            return password && password.length >= 8;
        case 'lowercase':
            return password && /(?=.*[a-z])/.test(password);
        case 'uppercase':
            return password && /(?=.*[A-Z])/.test(password);
        case 'digit':
            return password && /(?=.*\d)/.test(password);
        case 'specialChar':
            return password && /(?=.*[!@#$%^&*()_+{}|:;<>,.?/~`])/.test(password);
        case 'noSpace':
            return !/\s/.test(watch('password'));
        default:
            return false;
    }
  };

  
  const onSubmitAlexa = async (event) => {
    event.preventDefault();
    try 
    {
      setIsLoading(true);
      const response = await fetch('https://robe.host8b.me/WebServices/correo.php', 
      {
        method: 'POST',
        headers: 
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: userData.vchEmail,
          estado: 1
        }),
      });

      const result = await response.json();

      if (result.done) 
      {
        console.log('Login exitoso:', result);
      } 
      else
      {
        console.error('Error en el registro:', result.message);
      }
      
    } 
    catch (error) 
    {
      console.error('Error 500', error);
      setTimeout(() => 
      {
          alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.'); 
      }, 2000);
    } 
    finally 
    {
      setIsLoading(false);
    }
  }

  return (
    <section className='w-full flex flex-col'>
      <TitlePage label="Mi perfil" />
      <div className="flex flex-col md:flex-row">
        <div className='md:w-1/2 md:ml-4 md:flex flex-col gap-y-4 '>
          {/* Sección de información básica del usuario */}
          <div className="md:w-1/d2 mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
            <div className="flex space-x-4 xl:space-x-0">
              {/* Aquí mantengo sin cambios la parte que mencionaste */}
              <img
                alt=""
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                className="mb-2 h-20 w-20 rounded-lg"
              />
              <div className='ml-px	'>
                <h2 className="text-xl font-bold dark:text-white">{userData.vchNombre} {userData.vchAPaterno} {userData.vchAMaterno}</h2>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                    <FaUserTag className="mr-2 text-lg text-gray-900 dark:text-gray-100" />
                    {userData.roles}
                  </li>
                </ul>
              </div>
            </div>
            {/* Sección de información adicional del usuario */}
            <div className="mt-4">
              <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
                {/* Mantengo sin cambios el resto de la sección */}
                <div className="mt-4">Correo electronico</div>
                <a
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  href="mailto:webmaster@flowbite.com"
                >
                  {userData.vchEmail}
                </a>
                <div className="flex flex-col items-centoer mt-4">
                  <div>Estado de cuenta</div>
                  <div className={`w-4 h-4 rounded-full ${userData.enmEstadoCuenta ? 'bg-green-500' : 'bg-red-500'}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-5">
                    {userData.enmEstadoCuenta ? 'Activo' : 'Inactivo'}
                  </span>
                  </div>
                </div>
                <div className="flex flex-col items-centoer mt-4">
                  <div>Estado de inscripción</div>
                  <div className={`w-4 h-4 rounded-full ${userData.enmEstadoUsuario ? 'bg-green-500' : 'bg-red-500'}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-5">
                    {userData.enmEstadoUsuario ? 'Activo' : 'Inactivo'}
                  </span>
                  </div>
                </div>
                <div className="mt-4">
                  Número telefónico:
                </div>
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {editing ? (
                    <input
                      type="text"
                      value={newPhoneNumber}
                      onChange={handleChange}
                      className="ml-2 border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    <span>
                      {phoneNumber}
                    </span>
                  )}
                  <button onClick={editing ? handleSave : handleEdit} className="ml-2 text-blue-500">
                    <FaEdit />
                  </button>
                </div>
                <div className="mt-4">Fecha de registro</div>
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {userData.dtmfechaRegistro}
                </div>
              </address>
            </div>
            {/* Sección de habilidades de software */}
            <div>
              <TitleSection label="Logros Adicionales"/>
              <div className="flex space-x-3">
                <svg className="h-6 w-6" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.1558 0.559692H1.51087C0.676432 0.559692 0 1.23742 0 2.07346V15.7446C0 16.5806 0.676432 17.2583 1.51087 17.2583H15.1558C15.9902 17.2583 16.6667 16.5806 16.6667 15.7446V2.07346C16.6667 1.23742 15.9902 0.559692 15.1558 0.559692Z"
                    fill="#DC395F"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.58437 4.80783C6.58437 5.37806 6.12024 5.81314 5.56621 5.81314C5.01217 5.81314 4.54817 5.378 4.54817 4.80783C4.54817 4.23799 5.01217 3.80298 5.56621 3.80298C6.12024 3.80298 6.58437 4.23799 6.58437 4.80783ZM3.36574 11.9506C3.36574 11.726 3.39575 11.4506 3.45558 11.1956H3.45565L4.21913 8.07017H3.03638L3.39575 6.74185H6.24055L5.1175 11.2051C5.04263 11.4903 5.01268 11.7269 5.01268 11.8916C5.01268 12.1771 5.15292 12.2605 5.37219 12.3101C5.50572 12.34 6.56971 12.3191 7.14895 11.029L7.88658 8.07017H6.68872L7.0481 6.74185H9.60826L9.27896 8.24995C9.72805 7.40973 10.6265 6.61139 11.5098 6.61139C12.4531 6.61139 13.2317 7.28469 13.2317 8.57479C13.2317 8.90471 13.1867 9.2638 13.067 9.66874L12.5878 11.3933C12.543 11.5737 12.5129 11.7235 12.5129 11.8585C12.5129 12.1584 12.6327 12.3083 12.8573 12.3083C13.0819 12.3083 13.3664 12.1429 13.6958 11.2284L14.3546 11.4832C13.9652 12.8483 13.2616 13.4181 12.3782 13.4181C11.345 13.4181 10.8511 12.8035 10.8511 11.9631C10.8511 11.7233 10.8809 11.4681 10.9558 11.213L11.4499 9.44292C11.5098 9.24782 11.5248 9.06798 11.5248 8.90289C11.5248 8.33305 11.1805 7.98786 10.6265 7.98786C9.92271 7.98786 9.45858 8.49397 9.219 9.46901L8.26067 13.3201H6.58391L6.88488 12.1099C6.39198 12.9211 5.70741 13.4235 4.86301 13.4235C3.84484 13.4235 3.36574 12.8359 3.36574 11.9506Z"
                    fill="white"
                  ></path>
                </svg>
                {/* Aquí van los otros íconos */}
              </div>
            </div>
          </div>
          {/* Sección de Alexa */}
          <div className="md:w-1/d2 mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
            <div class="flex items-center justify-dcenter space-x-4">
              <img class="w-24 h-24 mb-4" src={AlexaLogo} alt="Alexa Logo" />
                <TitleSection label="Conectar con Alexa"/>
            </div>
            <Paragraphs label="Presiona el botón de abajo y te enviaremos un código de verificación para vincularte con Alexa."/>
            <form className="mb-4" onSubmit={onSubmitAlexa}>
              <LoadingButton
                loadingLabel="Enviando..."
                normalLabel="Enviar Código de Verificación"
                isLoading={isLoading}
              />
            </form>
          </div>
        </div>
        {/* Sección de información adicional del usuario */}
        <div className="md:w-1/2 md:ml-4 md:flex flex-col">
          <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
            <TitleSection label="Información adicional"/>
            <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
            {userData.intRol == null ? (
              <div>
                <div className="mt-4">Carrera</div>
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {userData.dataEstudiante.vchNomCarrera}      
                </div>
                <div className="mt-4">Cuatrimestre</div>
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {userData.dataEstudiante.vchNomCuatri}
                </div>
                <div className="mt-4">Grupo</div>
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {userData.dataEstudiante.chrGrupo}      
                </div>
                <div className="mt-4">Periodo</div>
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {userData.dataEstudiante.vchPeriodo}      
                </div>
              </div>
            ) : null}

   
            </address>
          </div>
        {/*seccion de Actualizar contraseña*/}
        <div className="md:w-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
          <TitleSection label="Actualizar contraseña"/>
            <form action="#">
              <div className="grid grid-cols-6 gap-x-4">
                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <div>
                          <CustomInputPassword
                              className="mb-0"
                              label="Contraseña Actual"
                              name="realpassword"
                              type={showPassword ? 'text' : 'password'}
                              errors={errors}
                              register={register}
                              trigger={trigger}
                              pattern={/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?/~`]).{8,15}$/}
                              errorMessage="La contraseña no cumple con el nivel de seguridad especificado."
                          />
                          <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-4 flex items-center"            
                          >
                              {showPassword ? 
                              (
                                  <FaEyeSlash className="text-gray-500" />
                              ) 
                              : 
                              (
                                  <FaEye className="text-gray-500" />
                              )
                              }
                          </button>
                      </div>
                </div>
                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                  <CustomInputPassword
                    className="mb-0"
                    label="Nueva Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    errors={errors}
                    register={register}
                    trigger={trigger}
                    pattern={/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?/~`]).{8,15}$/}
                    errorMessage="La contraseña no cumple con el nivel de seguridad especificado."
                  />
                </div>
                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                  <CustomRepeatPassword
                    type={showPassword ? 'text' : 'password'}
                    label="Repetir contraseña"
                    name="passwordRepeat"
                    errors={errors}
                    register={register}
                    trigger={trigger}
                    watch={watch}
                    errorMessage="Las contraseñas no coinciden."
                  />
                </div>
                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                  <LoadingButton
                    isLoading={isLoading}
                    loadingLabel="Cargando..."
                    normalLabel="Actualizar"
                  />
                </div>
                <div className="col-span-full">
                  <Card href="#" className={ errors.password  ? 'mb-4' : 'hidden'}>
                    <label htmlFor="" className='text-xs text-black-500 dark:text-gray-400 mt-3'>Tu contraseña debe tener:</label>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {validationItems.map(({ key, text }) => (
                        <PasswordValidationItem
                          key={key}
                          isValid={getPasswordValidationIcon(key)}
                          text={text}
                        />
                      ))}
                    </ul>
                      </Card>
                </div>
              </div>
            </form>
        </div>
        </div>
      </div>
    </section>

  );
};

export default PerfilUsuario;
