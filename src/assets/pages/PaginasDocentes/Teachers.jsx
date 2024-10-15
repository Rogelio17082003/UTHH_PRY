import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Table, Alert, Tooltip, Badge, ToggleSwitch, Card } from 'flowbite-react';
import { FaUser, FaCog, FaRegUser, FaRegEdit, FaRegEye, FaRegTrashAlt, FaEnvelope, FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { IoMdAdd, IoMdCreate, IoMdTrash } from 'react-icons/io';
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";

import { Label, TextInput, Button, Select, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import Components from '../../components/Components'
const { LoadingButton, CustomInput, CustomInputPassword, CustomRepeatPassword, SelectInput, CustomRepeatPassword2, newSelect,InfoAlert } = Components;
const PasswordValidationItem = ({ isValid, text }) => (
  <li className="flex items-center mb-1">
    {isValid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
    {text}
  </li>
);
const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [periodo, setPeriodo] = useState('');
  const [selectedPeriodo, setSelectedDepartamento] = useState(null); //Buscar docente por Departamento 
  const [selectedPeriodoManual, setSelectedDepartamentoManual] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosUpload, setAlumnosUpload] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalSuspender] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departamento, setDepartamento] = useState([]);// se guarda los departamento que existen
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [selectedDepartamento, setSelectedDepartamen] = useState(''); //se seleciona el departamento para  agregar docente 

  const [selectedPeriodoManualEdit, setSelectedDepartamentoEdit] = useState(null);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  //const [selectedDocenteEdit, setSelectedDocenteEdit] = useState(null); //editar a un docente 

  const handleOpenDeleteModal = (docente) => {
    setSelectedDocente(docente);
    setOpenModalSuspender(true);
    console.log(docente)
  };
  const handleConfirmDelete = () => {
    eliminarDocente(selectedDocente.vchMatricula);
    setOpenModalSuspender(false); // Cerrar el modal después de la eliminación
  };

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
    setValue,
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
      case 'Docente':
        return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="success" size="sm" icon={FaRegEdit}>Docente</Badge>;
      case 'Registro':
        return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="warning" size="sm" icon={FaRegUser}>Registro</Badge>;
      case 'Visualización':
        return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="failure" size="sm" icon={FaRegEye}>Visualización</Badge>;
      default:
        return <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full" color="info" size="sm" icon={FaUser}>Invitado</Badge>;
    }
  };

  const cargarDocentes = async () => {
    try {
      const response = await fetch(`${apiUrl}/buscarDocentes.php`);

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
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      //const periodo = sheet['C4'].v;
      //setPeriodo(periodo);

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 7 });

      const alumnosData = jsonData.map((fila) => {
        const correo = fila[4] ? fila[4].toLowerCase() : ''; // Convertir a minúsculas
        const correoSinAcentos = correo.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos

        const nombre = fila[3] ? fila[3].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        const apellidoPaterno = fila[1] ? fila[1].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        const apellidoMaterno = fila[2] ? fila[2].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        //const departamento = periodo ? periodo.toUpperCase() : '';


        return {
          MATRICULA: fila[0],
          APELLIDOPATERNO: apellidoPaterno,
          APELLIDOMATERNO: apellidoMaterno,
          NOMBRE: nombre,
          CORREO: correoSinAcentos,
          PASSWORD: fila[5],
          DEPARTAMENTO: "0",
        };
      })
        .filter((fila) => fila.MATRICULA && fila.NOMBRE && fila.APELLIDOPATERNO && fila.APELLIDOMATERNO && fila.DEPARTAMENTO);

      setAlumnosUpload(alumnosData);
      console.log('Datos del archivo Excel:', alumnosData);
    };

    reader.readAsArrayBuffer(file);
  };


  const handleClickRegistrar = () => {
    registrarEstudiantes(alumnosUpload);

  };

  const menu = async (nuevoDepartamento) => {
    setAlumnosUpload(prevAlumnos =>
      prevAlumnos.map(alumno => ({
        ...alumno,
        DEPARTAMENTO: nuevoDepartamento
      }))
    );

  };

  const registrarEstudiantes = async (alumnosData) => {
    try {
      setIsLoading(true);
      // Hacer solicitud para obtener las carreras
      console.log(JSON.stringify(alumnosData, null, 2));

      const response = await fetch(`${apiUrl}/registerTeachers.php`,
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

      if (result.done) {
        console.log(result.userData[0]);
        if (result.userData[0] == "Error al insertar al Docente (Usuario ya existente):") {
          setOpenModalAdd(false)
          setAlertMessage({ type: 'success', text: 'Docente ya registrado' });
          setSelectedDepartamen("")
          return

        }


        setAlertMessage({ type: 'success', text: 'Datos de Docentes registrados correctamente' });
        setOpenModalAdd(false)
        setSelectedDepartamen("")
      }
      else {
        setAlertMessage({ type: 'error', text: 'Error al registrar Docentes. Inténtalo de nuevo.' });
        console.log('Datos recibidos php:', result);
      }
    }
    catch (error) {
      setAlertMessage({ type: 'error', text: 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.' });
      console.error(error);
    }
    finally {
      setIsLoading(false);
      setOpenModal(false)
      setFile(null);

    }
  };
  useEffect(() => {
    {

      cargarDepartamentos()
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (selectedPeriodo) {
        console.log(selectedPeriodo)
        await cargarDocentesSelec(selectedPeriodo);


      }

    };

    loadData();
  }, [selectedPeriodo, selectedCarrera, selectedCuatrimestre, selectedGrupo]);


  ///cargar departamentos
  const cargarDepartamentos = async () => {
    try {
      const response = await fetch(`${apiUrl}/seeDepartamento.php`);
      const result = await response.json();

      if (!result.done) {
        throw new Error('Error al obtener las carreras');
      }
      console.log("hola");
      console.log(result);
      setDepartamento(result.message);
    }
    catch (error) {
      console.error(error);
    }
  }
  // Función para cargar las carreras
  const cargarDocentesSelec = async (periodo) => {
    try {
      // Hacer solicitud para obtener las carreras
      const response = await fetch(`${apiUrl}/oneDocente.php`,
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

      if (result.done) {
        setAlertMessage(false)
        setDocentes(result.message);
      }
      else {
        setAlertMessage({ type: 'error', text: 'No hay Docentes con el departamento seleccionado' });
        setServerErrorMessage("No hay Docentes con el departamento seleccionado"|| 'Error en el servidor.');
        setDocentes([]);

      }
    }
    catch (error) {
      console.log("mal");
      console.error(error);
    }
  };




  const [file, setFile] = useState(null);

  const handleDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    // Aquí puedes enviar el archivo a tu servidor para su procesamiento
  };


  ///// aqui le movi para insertar docente independiente

  const handleAddDocente = () => {
    const newDocente = {
      MATRICULA: watch('matriculaDocente'),
      NOMBRE: watch('nombre').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      APELLIDOPATERNO: watch('apellidoP').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      APELLIDOMATERNO: watch('apellidoM').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      DEPARTAMENTO: selectedPeriodoManual,
      CORREO: watch('correo').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      PASSWORD: watch('matriculaDocente'),
    };

    // Crear un array con dos objetos iguales
    const duplicatedDocentes = [newDocente];

    // Log para verificar los datos
    console.log('Datos duplicados:', duplicatedDocentes);

    // Pasar el array al método que realiza la inserción
    registrarEstudiantes(duplicatedDocentes);

  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validateForm = () => {
    const matricula = watch('matriculaDocente');
    const nombre = watch('nombre');
    const apellidoP = watch('apellidoP');
    const apellidoM = watch('apellidoM');
    const correo = watch('correo');
    //const Departamento= selectedPeriodoManual;
    const Departamento = selectedPeriodoManual || watch('vchDepartamento');
    console.log(Departamento)

    // Expresión regular para validar el correo institucional
    const emailPattern = /^[a-zA-Z0-9._%+-]+@uthh\.edu\.mx$/;

    const isDepartamentoValid = Departamento && Departamento !== "0";
    const isMatriculaValid = /^\d+$/.test(matricula); // Verificar si la matrícula son solo números
    const isCorreoValid = emailPattern.test(correo); // Verificar si el correo cumple con el patrón
    const areFieldsFilled = matricula && nombre && apellidoP && apellidoM && correo && isDepartamentoValid;

    // Habilitar o deshabilitar el botón basado en todas las validaciones
    setIsButtonDisabled(!(isMatriculaValid && areFieldsFilled && isCorreoValid));
  };

  useEffect(() => {
    validateForm();
  }, [watch('matriculaDocente'), watch('nombre'), watch('apellidoP'), watch('apellidoM'), watch('correo'), watch('vchDepartamento'), selectedPeriodoManual]);


  //suspender docente
  const eliminarDocente = async (matricula) => {
    console.log(matricula)
    try {
      const response = await fetch(`${apiUrl}SuspenderDocente.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Matricula: matricula,

          }),
        });



      if (response.ok) {
        const result = await response.json();
        console.log(result);
        cargarDocentes();
        setAlertMessage({ type: 'error', text: result.message });
        setServerErrorMessage(result.message || 'Error en el servidor.');
      } else {
        const errorData = await response.json();
        alert(`Hubo un problema al actulizar el docente: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al actualizar  el docente:', error);
      alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
    }
  };


  //Editar docente
  const [selectedDocenteRol, setSelectedDocenteRol] = useState(null);
  const [selectedDocenteEstado, setSelectedDocenteEstado] = useState(null);
  const [selectedDocenteDepartamento, setselectedDocenteDepartamento] = useState(null);
  const [selectedDocenteMA, setselectedDocenteselectedDocenteMA] = useState(null);
  ///editar docente 
  const EditUser = (docente) => {
    //setSelectedDocenteEdit(docente);
    setOpenModalEdit(true);
    setValue('matriculaEdit', docente.vchMatricula);
    setValue('nombreEdit', docente.vchNombre);
    setValue('apellidoAPedit', docente.vchAPaterno);
    setValue('apellidoAMedit', docente.vchAMaterno);
    setValue('correoEdit', docente.vchEmail);
    setValue('departamentoEdit', docente.vchDepartamento);
    setValue('editRol', docente.vchNombreRol == "Administrador" ? "1":"2");
    setValue('editEstado', docente.enmEstadoCuenta);



    setSelectedDocenteRol(docente.vchNombreRol== "Administrador" ? "1":"2")
    setSelectedDocenteEstado(docente.enmEstadoCuenta)
    setselectedDocenteDepartamento(docente.vchDepartamento);
    setselectedDocenteselectedDocenteMA(docente.vchMatricula);
  };


  const [inputValue, setInputValue] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [unlockButton, setUnlock] = useState(false);
  //selectedDocente
  //MATRICULA: watch('nombreEdit'),

  useEffect(() => {
    // Revisar si el valor de la caja de texto es "hola"
    if (watch('nombreEdit') === 'hola') {
      setUnlock(true);
    } else {
      setUnlock(false);
    }
  }, [watch('nombreEdit')]);  // Ejecutar el efecto cada vez que cambie inputValue




  const [selecEditDe, setselecEditDe] = useState("");
  const [isDisable, setisDisable] = useState("");
  //editar docente
  const [datosDo, setdatosDo] = useState();

  const validateForm2 = () => {

    const nombre = (watch('nombreEdit') || '').toUpperCase();
    const apellidoP = (watch('apellidoAPedit') || '').toUpperCase();
    const apellidoM = (watch('apellidoAMedit') || '').toUpperCase();
    const edirRol = (watch('editRol') || '');
    const ediEstado = (watch('editEstado') || '');


    const correo = watch('correoEdit');
    const Departamento = (watch('departamentoEdit') || '');
    //const Departamento = selecEditDe || watch('departamentoEdit');

    console.log(Departamento, nombre, apellidoP, apellidoM, correo, edirRol, ediEstado)

    // Expresión regular para validar el correo institucional
    const emailPattern = /^[a-zA-Z0-9._%+-]+@uthh\.edu\.mx$/;

    const isDepartamentoValid = Departamento && Departamento !== "0";
    //const isMatriculaValid = /^\d+$/.test(matricula); // Verificar si la matrícula son solo números
    const isCorreoValid = emailPattern.test(correo); // Verificar si el correo cumple con el patrón
    const areFieldsFilled = nombre && apellidoP && apellidoM && correo && isDepartamentoValid;

    // Habilitar o deshabilitar el botón basado en todas las validaciones
    setisDisable(!(areFieldsFilled && isCorreoValid));

    const datosDocente = {
      matricula: selectedDocenteMA,
      nombre: nombre,             // nombre en mayúsculas
      apellidoP: apellidoP,       // apellido paterno en mayúsculas
      apellidoM: apellidoM,       // apellido materno en mayúsculas
      rol: edirRol,               // rol seleccionado
      estado: ediEstado,          // estado seleccionado
      correo: correo,             // correo del docente
      departamento: Departamento  // departamento seleccionado
    };

    setdatosDo(datosDocente)

  };

  useEffect(() => {
    validateForm2();
  }, [
    watch('nombreEdit'),
    watch('apellidoAPedit'),
    watch('apellidoAMedit'),
    watch('correoEdit'),
    watch('departamentoEdit'),
    selecEditDe,
    watch('editRol'),
    watch('editEstado'),
    selectedDocente,
    selectedDocenteDepartamento
  ]);

  useEffect(() => {
    console.log(datosDo);
  }, [datosDo]);  // Verifica el estado actualizado de datosDo


  // variables para modalupdate docente

  const [openConfirm, setOpenConfirm] = useState(false);

  const update = async  (data) => {
    try {
      const response = await fetch(`${apiUrl}/UpdateTeachers.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      
      

      const result = await response.json(); // Asumiendo que la respuesta es JSON
      console.log( result);
      if (result.done) {
        setAlertMessage({ type: 'error', text: result.message });
        setServerErrorMessage(result.message || 'Error en el servidor.');
        cargarDocentes();
        
      }
    } catch (error) {
      console.error('Error during fetch operation:', error);
      alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
    }
    finally
    {
      setOpenConfirm(false)
      setOpenModalEdit(false);
    }
  };







  return (
    <section className='flex flex-col'>
      <InfoAlert
                message={serverErrorMessage}
                type="success"
                isVisible={!!serverErrorMessage}
                onClose={() => setServerErrorMessage('')}
            />
      <Modal className='mt-11 pt-16' size="4xl" base show={openModal} onClose={() => { setOpenModal(false); setFile(null); setSelectedDepartamen("") }}>
        <Modal.Header>Agregar Docentes </Modal.Header>
        <Modal.Body className='max-h-60'>
          <div className="space-y-6">
            <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Selecciona un archivo en formato excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {file !== null && (
              <section>
                <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Datos recibidos</h3>
                <div>



                  <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {/*periodo*/}

                    <SelectInput
                      id="IdDepartamento"
                      labelSelect="Seleccionar Departamento"
                      label="Departamento"
                      name="vchDepartamento"
                      option=""
                      options={departamento}
                      errorMessage="No cumples con el patron de contraseña"
                      errors={errors}
                      register={register}
                      trigger={trigger}
                      onChange={(e) => {
                        menu(e.target.value);
                        setSelectedDepartamen(e.target.value);
                        // Cargar carreras al seleccionar periodo
                      }}

                    />

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
                          <Table.Cell>{alumnosExcel.NOMBRE} {alumnosExcel.APELLIDOPATERNO} {alumnosExcel.APELLIDOMATERNO}</Table.Cell>
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
            disabled={!selectedDepartamento || selectedDepartamento === "0"} // Deshabilita si no se ha seleccionado un valor válido
          />
          <Button color="gray" onClick={() => { setOpenModal(false); setFile(null); setSelectedDepartamen("") }}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalDelete} size="md" onClose={() => setOpenModalSuspender(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas suspeder a este Docente?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => { setOpenModalSuspender(false); handleConfirmDelete(); }}>
                {"Sí estoy seguro"}
              </Button>
              <Button color="gray" onClick={() => setOpenModalSuspender(false)}>
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
            <form className="flex flex-col gap-4 max-w-lg mx-auto">
              <CustomInput
                label="Matrícula"
                name="matriculaEdit"
                errorMessage="Solo números y sin espacios"
                errors={errors}
                register={register}
                trigger={trigger}
                readOnly={true}
              // Estilos Tailwind
              />
              <CustomInput
                label="Nombre"
                name="nombreEdit"
                errors={errors}
                register={register}
                trigger={trigger}
                style={{ textTransform: 'uppercase' }}
              />
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Apellido Paterno"
                  name="apellidoAPedit"
                  errors={errors}
                  register={register}
                  trigger={trigger}
                  style={{ textTransform: 'uppercase' }}
                />
                <CustomInput
                  label="Apellido Materno"
                  name="apellidoAMedit"
                  errors={errors}
                  register={register}
                  trigger={trigger}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <CustomInput
                label="Correo"
                name="correoEdit"
                errors={errors}
                errorMessage={"El correo no pertenece a la Institucion"}
                register={register}
                trigger={trigger}
                pattern={/^[a-zA-Z0-9._%+-]+@uthh\.edu\.mx$/}
                style={{ textTransform: 'lowercase' }}
              />
        
              {
                <div className="max-w-md">
                  <div className="mb-2 block">
                    <Label htmlFor="departamentoEdit" value="Departamento" />
                  </div>
                  <select
                    name="departamentoEdit"
                    id="departamentoEdit"
                    {...register('departamentoEdit')}
                    className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDocenteDepartamento}
                    onChange={(e) => setselectedDocenteDepartamento(e.target.value)}

                  >
                    {departamento.map((dep) => (
                      <option
                        key={dep.IdDepartamento}
                        value={dep.IdDepartamento}
                      >
                        {dep.vchDepartamento}
                      </option>
                    ))}
                  </select>
                </div>

              }




              <div className="grid grid-cols-2 gap-44">
                <div>
                  <Label htmlFor="editRol" value="Roles" />
                  <Select
                    id="editRol"
                    name="editRol"
                    required
                    {...register('editRol')}
                    value={selectedDocenteRol} // Controla el valor seleccionado con `value`
                    onChange={(e) => setSelectedDocenteRol(e.target.value)} // Asegúrate de manejar el cambio correctamente
                  >
                    <option value="1">Administrador</option>
                    <option value="2">Docente</option>
                  </Select>

                </div>

                <div>
                  <Label htmlFor="editEstado" value="Estado de Cuenta" />
                  <Select
                    id="editEstado"
                    name="editEstado"
                    required
                    {...register('editEstado')}
                    value={selectedDocenteEstado} // Controla el valor seleccionado
                    onChange={(e) => setSelectedDocenteEstado(e.target.value)} // Actualiza el estado cuando se cambia la selección
                  >
                    <option value="activa">Activa</option>
                    <option value="bloqueada">Bloqueada</option>
                  </Select>
                </div>

              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton
            className="max-w-32 max-h-11"
            onClick={() => { setOpenConfirm(true) }}
            isLoading={isLoading}
            loadingLabel="Cargando..."
            normalLabel="Actualizar"
            disabled={isDisable}
          />
          <Button color="gray" onClick={() => { setOpenModalEdit(false); setFile(null) }}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>


      {/*modal para confirmar update*/}
      <Modal show={openConfirm} onClose={() => { setOpenConfirm(false) }} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas Actualizar a este Docente?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => { update(datosDo) }}>
                {"Sí estoy seguro"}
              </Button>
              <Button color="gray" onClick={() => { setOpenConfirm(false) }}>
                No, cancelar
              </Button>
            </div>
          </div>

        </Modal.Body>

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
          {/* Botón para abrir el modal de agregar docente */}
          <Button icon={IoMdAdd} className="ml-2" onClick={() => setOpenModalAdd(true)}>
            <IoMdAdd className="mr-2 h-5 w-5" />
            Añadir Docente
          </Button>
        </div>

        <div>
          <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">Consultar Docentes</h3>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="departamento" value="Departamento" />
            </div>
            <Select id="departamento" required
              onChange={(e) => {
                setSelectedDepartamento(e.target.value);

              }}
            >
              <option>Seleccionar Departamento</option>
              {departamento.map((departamento) => (
                <option key={departamento.IdDepartamento} value={departamento.IdDepartamento}>
                  {departamento.vchDepartamento}
                </option>
              ))}
            </Select>
          </div>



        </div>
        <section className='flex flex-col'>

          {/* Modal para agregar un docente  manual*/}
          <Modal show={openModalAdd} size="lg" onClose={() => setOpenModalAdd(false)}>
            <Modal.Header>Agregar Docente</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <form className="flex flex-col gap-4">
                  <CustomInput
                    label="Matrícula"
                    name="matriculaDocente"
                    pattern={/^\d+$/}
                    errorMessage="Solo números y sin espacios"
                    errors={errors}
                    register={register}
                    trigger={trigger}
                    className="w-full"
                    
                  />
                  <div className="flex flex-wrap gap-4">
                    <CustomInput
                      label="Nombre"
                      name="nombre"
                      errors={errors}
                      register={register}
                      trigger={trigger}
                      className="w-full md:w-1/2"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <CustomInput
                      label="Apellido Paterno"
                      name="apellidoP"
                      errors={errors}
                      register={register}
                      trigger={trigger}
                      className="w-full md:w-1/2"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <CustomInput
                      label="Apellido Materno"
                      name="apellidoM"
                      errors={errors}
                      register={register}
                      trigger={trigger}
                      className="w-full md:w-1/2"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <SelectInput
                      id="IdDepartamento"
                      labelSelect="Seleccionar Departamento"
                      label="Departamento"
                      name="vchDepartamento"
                      option=""
                      options={departamento}
                      errors={errors}
                      register={register}
                      trigger={trigger}
                      onChange={(e) => {
                        setSelectedDepartamentoManual(e.target.value);

                      }}

                    />
                  </div>
                  <CustomInput
                    label="Correo"
                    name="correo"
                    errors={errors}
                    errorMessage={"El correo no pertenece a la Institucion"}
                    register={register}
                    trigger={trigger}
                    className="w-full"
                    pattern={/^[a-zA-Z0-9._%+-]+@uthh\.edu\.mx$/}
                  />

                </form>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-between">
              <LoadingButton
                className="w-full md:w-auto"
                onClick={handleAddDocente}
                isLoading={isLoading}
                loadingLabel="Cargando..."
                normalLabel="Agregar"
                disabled={isButtonDisabled} // Deshabilita el botón si `isButtonDisabled` es `true`
              />
              <Button color="gray" onClick={() => setOpenModalAdd(false)} className="w-full md:w-auto">
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
        </section>

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
              <Table.HeadCell className="px-4 py-3">Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {docentes.map((docente) => (
                <Table.Row key={docente.vchMatricula} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="p-4">
                    <Checkbox value={docente.vchMatricula} />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {docente.vchMatricula}
                  </Table.Cell>
                  <Table.Cell>{docente.vchNombre } {docente.vchAPaterno} {docente.vchAMaterno}</Table.Cell>
                  <Table.Cell>{renderBadge(docente.vchNombreRol)}</Table.Cell>
                  <Table.Cell>{docente.vchEmail}</Table.Cell>
                  <Table.Cell>
                    <div className={`w-4 h-4 rounded-full ${docente.enmEstadoCuenta === 'activa' ? 'bg-green-500' : 'bg-red-500'}`}>
                      <span className="ml-5">
                        {docente.enmEstadoCuenta === 'activa' ? 'Activo' : 'Bloqueada'}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3 flex items-center justify-end">
                    <Tooltip content="Acciones" placement="left">
                      <button
                        onClick={() => toggleActionsMenu(docente.vchMatricula)}
                        className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
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

                    {activeMenu === docente.vchMatricula && (
                      <div className="mr-12 absolute z-10 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-1 text-sm" aria-labelledby="apple-imac-27-dropdown-button">
                          <li>
                            <button
                              type="button" data-modal-target="updateProductModal" data-modal-toggle="updateProductModal"
                              className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                              //onClick={() => setOpenModalEdit(true)}
                              onClick={() => EditUser(docente)}
                            >
                              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                              </svg>
                              Editar
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                              onClick={() => handleOpenDeleteModal(docente)}  // Abrir modal de confirmación
                            >
                              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 18.66 18.24 16.44 19.77L4.23 7.56C5.76 5.34 8.69 4 12 4Z" />
                                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                              </svg>
                              Bloquear
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

        </div>
      </div>
    </section>
  );
};

export default Docentes;
