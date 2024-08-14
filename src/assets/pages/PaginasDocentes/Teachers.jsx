import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate} from 'react-router-dom'; 
import { Checkbox, Table, Alert, Tooltip, Badge, ToggleSwitch, Card} from 'flowbite-react';
import { FaUser, FaCog, FaRegUser, FaRegEdit, FaRegEye, FaRegTrashAlt, FaEnvelope, FaCheck, FaTimes, FaEye, FaEyeSlash  } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { IoMdAdd, IoMdCreate, IoMdTrash } from 'react-icons/io';
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";

import { Label, TextInput, Button, Select, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import  Components from '../../components/Components'
const { LoadingButton, CustomInput, CustomInputPassword, CustomRepeatPassword} = Components;
const PasswordValidationItem = ({ isValid, text }) => (
  <li className="flex items-center mb-1">
    {isValid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
    {text}
  </li>
);
const Docentes = () => {
    const [docentes, setDocentes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [cuatrimestres, setCuatrimestres] = useState([]);
  const [periodo, setPeriodo] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosUpload, setAlumnosUpload] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const toggleActionsMenu = (matricula) => {
    if (activeMenu === matricula) {
      // Si el mismo menú está abierto, ciérralo
      setActiveMenu(null);
    } else {
      // Abre el menú clickeado y cierra los demás
      setActiveMenu(matricula);
    }
  };

  // Manejar cambios en el estado del toggle
  const handleToggleChange = () => {
    setIsChecked(!isChecked); // Invierte el estado actual
  };

  useEffect(() => {
    cargarDocentes();
  }, []);

    const renderBadge = (role) => {
        switch (role) {
          case 'Administrador':
            return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="info" size="sm" icon={FaCog}>Administrador</Badge>;
          case 'Editor':
            return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="success" size="sm"  icon={FaRegEdit}>Editor</Badge>;
          case 'Registro':
            return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="warning" size="sm"  icon={FaRegUser}>Registro</Badge>;
          case 'Visualización':
            return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="failure" size="sm"  icon={FaRegEye}>Visualización</Badge>;
          default:
            return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="info" size="sm"  icon={FaUser}>Invitado</Badge>;
        }
      };
  
  const cargarDocentes = async () => {
    try {
      const response = await fetch('https://robe.host8b.me/WebServices/buscarDocentes.php');
      const result = await response.json();

      if (result.done) {
        setDocentes(result.message);
        console.log(result)
      } else {
        setAlertMessage({ type: 'error', text: 'Error al obtener los docentes. Inténtalo de nuevo.' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.' });
      console.error(error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setFile(event);

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        // Obtener información adicional
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const periodo = sheet['B2'].v;
        setPeriodo(periodo);
        // Obtener datos de los alumnos
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 7 });
        // Procesar los datos para obtener un array de objetos
        const alumnosData = jsonData.map((fila) => {
            return {
                MATRICULA: fila[0],
                NOMBRE: fila[1],
                APELLIDOMATERNO: fila[2],
                APELLIDOPATERNO: fila[3],
                CORREO: fila[4],
                PASSWORD: fila[5],                
            };
        });
        setAlumnosUpload(alumnosData);
        console.log('Datos del archivo Excel:', alumnosData);
    };

    reader.readAsArrayBuffer(file);
};

const handleClickRegistrar = () => {
  registrarEstudiantes(alumnosUpload);
};

const registrarEstudiantes = async (alumnosData) => 
{
  try 
  {
    setIsLoading(true);
    // Hacer solicitud para obtener las carreras
    const response = await fetch('https://robe.host8b.me/WebServices/registerTeachers.php',
      {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify
        ({
          dataEstudiantes: alumnosData,
        }),
      }
    );
    const result = await response.json();

    if (result.done) 
    {
      setAlertMessage({ type: 'success', text: 'Datos de estudiantes registrados correctamente' });
      console.log('Datos recibidos php:', result);
    }
    else
    {                
      setAlertMessage({ type: 'error', text: 'Error al registrar estudiantes. Inténtalo de nuevo.' });
      console.log('Datos recibidos php:', result);
    }
  } 
  catch (error) 
  {
    setAlertMessage({ type: 'error', text: 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.' });
    console.error(error);
  }
  finally 
  {
    setIsLoading(false);
    setOpenModal(false)
    setFile(null);
  }
};
  useEffect(() => {
    {
      cargarPeriodos()
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (selectedPeriodo) {
        await cargarCarreras(selectedPeriodo);
      }
      if (selectedCarrera) {
        await cargarCuatrimestres(selectedCarrera);
      }
      if (selectedCuatrimestre) {
        await cargarGrupos(selectedCuatrimestre);
      }
      if (selectedGrupo) {
        await cargarAlumnos(selectedGrupo);
      }
    };
  
    loadData();
  }, [selectedPeriodo, selectedCarrera, selectedCuatrimestre, selectedGrupo]);
  
  const cargarPeriodos = async () => 
  {
    try
    {
      const response = await fetch('https://robe.host8b.me/WebServices/obtener-periodos.php');
      const result = await response.json();

      if (!result.done) 
      {
        throw new Error('Error al obtener las carreras');
      }
      console.log(result);
      setPeriodos(result.message);
    }
    catch(error)
    {
      console.error(error);
    } 
  }
    // Función para cargar las carreras
    const cargarCarreras = async (periodo) => 
    {
      try 
      {
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerCarreras.php',
        {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              periodo: periodo,
          }),
        });
        const result = await response.json();
        console.log(result);
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setCarreras(result.message);
        }
        else{
          setCarreras([]);
        }
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    const cargarCuatrimestres = async (carrera) => 
    {
      try 
      {
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerCuatrimestres.php',
        {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carrera: carrera,
            idPeriodo: selectedPeriodo,

          }),
        });
        const result = await response.json();
        console.log(result);
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setCuatrimestres(result.message);
        }
        else
        {
          setCuatrimestres([]);
        }
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    const cargarGrupos = async (cuatrimestre) => 
    {
      try 
      {
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerGrupos.php',
        {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cuatrimestre: cuatrimestre,
            idPeriodo: selectedPeriodo,
          }),
        });
        const result = await response.json();
        console.log(result);
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setGrupos(result.message);
        }
        else{
          setGrupos([]);
        }
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    const cargarAlumnos = async (grupo) => {
      try {
        const requestBody = {
          idPeriodo: selectedPeriodo,
          idCarrera: selectedCarrera,
          idCuatrimestre: selectedCuatrimestre,
          idGrupo: grupo,
        };
    
        console.log('Cuerpo de la solicitud:', requestBody);
    
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerResultados.php',
        {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPeriodo: selectedPeriodo,
            idCarrera: selectedCarrera,
            idCuatrimestre: selectedCuatrimestre,
            idGrupo: grupo,
          }),
        });

        const result = await response.json();
        console.log(result);
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setAlumnos(result.message);
        }    
      } catch (error) {
        console.error(error);
      }
    };

  const [file, setFile] = useState(null);

  const handleDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    // Aquí puedes enviar el archivo a tu servidor para su procesamiento
  };

  return (
    <section className='flex flex-col'>
      {alertMessage && (
        <Alert type={alertMessage.type} onClose={() => setAlertMessage(null)}>
          {alertMessage.text}
        </Alert>
      )}
      <Modal className='mt-11 pt-16' size="4xl" base show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Agregar Docentes</Modal.Header>
        <Modal.Body className='max-h-60'>
          <div className="space-y-6">
            <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Selecciona un archivo en formato excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {file !==null && (
              <section>
                <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Datos recibidos</h3>
                <div>
                    <div className='grid grid-cols-2 grid-rows-2 gap-4 m-y-2 mb-4'>
                      <div className='flex-row'>
                        <div className="mt-4">Departamento</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {periodo}
                        </div>
                      </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>Matricula</Table.HeadCell>
                      <Table.HeadCell>Nombre</Table.HeadCell>
                      <Table.HeadCell>Correo</Table.HeadCell>
                      <Table.HeadCell>Contraseña</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {alumnosUpload.map((alumnosExcel, index) =>
                          (
                          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {alumnosExcel.MATRICULA}
                            </Table.Cell>
                            <Table.Cell>{alumnosExcel.NOMBRE} {alumnosExcel.APELLIDOMATERNO} {alumnosExcel.APELLIDOPATERNO}</Table.Cell>
                            <Table.Cell>{alumnosExcel.CORREO}</Table.Cell>
                            <Table.Cell>{alumnosExcel.PASSWORD}</Table.Cell>
                          </Table.Row>
                          ))
                        }
                    </Table.Body>
                  </Table>
                </div>
              </section>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton
            className="max-w-32 max-h-11" // Clase de Tailwind CSS para definir un ancho máximo
            onClick={handleClickRegistrar} 
            isLoading={isLoading}
            loadingLabel="Cargando..."
            normalLabel="Agregar"
          />
          <Button color="gray" onClick={() => {setOpenModal(false); setFile(null)}}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={openModalDelete} size="md" onClose={() => setOpenModalDelete(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas eliminar a este Docente?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => setOpenModalDelete(false)}>
                {"Sí estoy seguro"}
              </Button>
              <Button color="gray" onClick={() => setOpenModalDelete(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className='mt-11 pt-16' show={openModalEdit} size="4xl" onClose={() => setOpenModalEdit(false)} popup>
        <Modal.Header>Editar Docente</Modal.Header>
        <Modal.Body className='max-h-60'>
            <div className="space-y-6">
                <form className="flex max-w-md flex-col gap-4">
                    <CustomInput
                        label="Matrícula"
                        name="matriculaDocente"
                        pattern={/^\d+$/}
                        errorMessage="Solo números y sin espacios"
                        errors={errors}
                        register={register}
                        trigger={trigger}
                    />
                    <CustomInput
                        label="Nombre"
                        name="nombre"
                        pattern={/^\d+$/}
                        errorMessage="Solo números y sin espacios"
                        errors={errors}
                        register={register}
                        trigger={trigger}
                    />
                    <CustomInput
                        label="Apellido Paterno"
                        name="apellidoP"
                        pattern={/^\d+$/}
                        errorMessage="Solo números y sin espacios"
                        errors={errors}
                        register={register}
                        trigger={trigger}
                    />
                    <CustomInput
                        label="Apellido Materno"
                        name="apellidoM"
                        pattern={/^\d+$/}
                        errorMessage="Solo números y sin espacios"
                        errors={errors}
                        register={register}
                        trigger={trigger}
                    />
                    <CustomInput
                        label="Correo"
                        name="correo"
                        pattern={/^\d+$/}
                        errorMessage="Solo números y sin espacios"
                        errors={errors}
                        register={register}
                        trigger={trigger}
                    />
                                        <div className="relative">
                        <CustomInputPassword
                            label="Contraseña"
                            name="password"
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
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="countries" value="Roles" />
                        </div>
                        <Select id="countries" required>
                            <option>Administrador</option>
                            <option>Editor</option>
                            <option>Registro</option>
                            <option>Visualización</option>
                        </Select>
                    </div>
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="countries" value="Estado de Cuenta" />
                        </div>
                        
                        <Select id="countries" required>
                            <option>Activa</option>
                            <option>Bloqueada</option>
                        </Select>
                    </div>
                    <div>
                      <label htmlFor="toggle" className="flex items-center cursor-pointer">
                      <Label htmlFor="countries" value="Estado de Cuenta" />
                        <ToggleSwitch
                          color={` ${isChecked ? 'bg-green-500' : 'bg-gray-300'}`} 
                          id="toggle"
                          checked={isChecked}
                          onChange={handleToggleChange}
                          className={`ml-2 ${isChecked ? 'bg-green-500' : 'bg-gray-300'}`} // Aplicar color verde cuando está activado
                          />
                      </label>
                      <p>Estado: {isChecked ? 'Activado' : 'Bloqueada'}</p>
                  </div>
                </form>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton
            className="max-w-32 max-h-11" // Clase de Tailwind CSS para definir un ancho máximo
            onClick={handleClickRegistrar} 
            isLoading={isLoading}
            loadingLabel="Cargando..."
            normalLabel="Agregar"
          />
          <Button color="gray" onClick={() => {setOpenModal(false); setFile(null)}}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <h1 className="m-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Docentes</h1>
      <div className="w-full mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 grid gap-4">
        {/*<div className="mb-2 block">
          <Label htmlFor="email4" value="Buscar docente" />
        </div>*/}
        <div className="flex items-center">
          {/*<TextInput id="email4" type="email" icon={HiOutlineSearch} placeholder="Matricula del Docente" required />*/}
          <Button icon={IoMdAdd} className="ml-2" onClick={() => setOpenModal(true)}>
            <IoMdAdd className="mr-2 h-5 w-5" />
            Añadir Docentes
          </Button> 
        </div>
        {/*
        <div>
          <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">Consultar Docentes</h3>
          <div className='grid grid-cols-2 grid-rows-2 gap-4'>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="departamento" value="Departamento" />
              </div>
              <Select id="departamento" required 
                onChange={(e) => {
                  setSelectedPeriodo(e.target.value);
                  // Cargar carreras al seleccionar periodo
                }}
              >
                <option value="1">Seleccionar Departamento </option>
                {periodos.map((periodo) => (
                  <option key={periodo.intIdPeriodo} value={periodo.intIdPeriodo}>
                    {periodo.vchPeriodo}
                  </option>
                ))}
              </Select>
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="roles" value="Roles" />
              </div>
              <Select id="carrera" required   
                onChange={(e) => {
                  setSelectedCarrera(e.target.value);
                  // Cargar cuatrimestres al seleccionar carrera
                }}
              >
                <option value="">Seleccionar Rol</option>
                {carreras.map((carrera) => (
                  <option key={carrera.intClvCarrera} value={carrera.intClvCarrera}>
                    {carrera.vchNomCarrera}
                  </option>
                ))}
              </Select>
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="estadoCuenta" value="Estado de Cuenta" />
              </div>
              <Select id="cuatrimestre" required  
                onChange={(e) => {
                  setSelectedCuatrimestre(e.target.value);
                  // Cargar grupos al seleccionar cuatrimestre
                }}
              >
                <option value="">Seleccionar estado de cuenta</option>
                {cuatrimestres.map((cuatrimestre) => (
                  <option key={cuatrimestre.intClvCuatrimestre} value={cuatrimestre.intClvCuatrimestre}>
                    {cuatrimestre.vchNomCuatri}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        */}
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="p-4">
                <Checkbox />
              </Table.HeadCell>
              <Table.HeadCell>Matricula</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>Correo</Table.HeadCell>
              <Table.HeadCell>Estado de cuenta</Table.HeadCell>
              <Table.HeadCell className='px-4 py-3'>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
            {docentes.map((docentes) =>
              (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="p-4">
                    <Checkbox />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {docentes.vchMatricula}
                  </Table.Cell>
                  <Table.Cell>{docentes.vchNombre} {docentes.vchAPaterno} {docentes.vchAMaterno}</Table.Cell>
                  <Table.Cell>{renderBadge(docentes.vchNombreRol)}</Table.Cell>
                  <Table.Cell>{docentes.vchEmail}</Table.Cell>
                  <Table.Cell> 
                    <div className={`w-4 h-4 rounded-full ${docentes.enmEstadoCuenta=='activa' ? 'bg-green-500' : 'bg-red-500'}`}>
                      <span className=" ml-5">
                        {docentes.enmEstadoCuenta=='activa' ? 'Activo' : 'Bloqueda'}
                      </span>                
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3 flex items-center justify-end">
                  <Tooltip content="Acciones" placement="left">
                      <button
                        onClick={() => toggleActionsMenu(docentes.vchMatricula)} // Pasar la matrícula como parámetro
                        className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </Tooltip>

                    {activeMenu === docentes.vchMatricula && (
                      <div class="mr-12	absolute z-10 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                      <ul class="py-1 text-sm" aria-labelledby="apple-imac-27-dropdown-button">
                          <li>
                              <button type="button" data-modal-target="updateProductModal" data-modal-toggle="updateProductModal" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                onClick={() => setOpenModalEdit(true)}

                              >
                                  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                  </svg>
                                  Editar
                              </button>
                          </li>
                          <li>
                              <button type="button" data-modal-target="readProductModal" data-modal-toggle="readProductModal" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
                                  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                  Detalles
                              </button>
                          </li>
                          <li>
                              <button type="button" data-modal-target="deleteModal" data-modal-toggle="deleteModal" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                onClick={() => setOpenModalDelete(true)}
                              >
                                  <svg class="w-4 h-4 mr-2" viewbox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                      <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                  </svg>
                                  Eliminar
                              </button>
                          </li>
                      </ul>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            }
            </Table.Body>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default Docentes;
