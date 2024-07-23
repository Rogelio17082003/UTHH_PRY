import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Components from '../../components/Components';
const { TitlePage, Paragraphs, TitleSection, LoadingButton, CustomInputOnchange } = Components;
import { Tooltip } from 'flowbite-react';
import { useAuth } from '../../server/authUser'; // Importar el hook de autenticación
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Tabs, Accordion } from "flowbite-react";
import { MdDescription, MdAssignment } from "react-icons/md";

const DetallePractica = () => {
  const { intNumeroPractica } = useParams();
  const [detalleActividad, setDetalleActividad] = useState({});
  const { isAuthenticated, userData } = useAuth();
  const [rubricaData, setRubricaData] = useState([]);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [alumnos, setAlumnosMaterias] = useState([]);
  const {vchClvMateria, chrGrupo, intPeriodo } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const validatePuntajeTotal = (data) => {
    return data.reduce((sum, rubrica) => sum + (parseInt(rubrica.intValor) || 0), 0) <= 10;
  };

  const handleEditClick = () => {
    setEditedData([...rubricaData]); // Guarda una copia de rubricaData en editedData
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!validatePuntajeTotal(editedData)) {
      alert('El puntaje total no puede exceder de 10 puntos.');
      return;
    }

    try {
      const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedRubrica: editedData }),
      });
      const data = await response.json();

      if (data.done) {
        setRubricaData(editedData);
        localStorage.setItem('rubricaData', JSON.stringify(editedData)); // Guardar en localStorage
        setIsEditing(false);
      } else {
        console.error('Error al actualizar la rúbrica');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCancelClick = () => {
    const storedData = localStorage.getItem('rubricaData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setEditedData(parsedData);
      setRubricaData(parsedData); // Restaurar rubricaData desde localStorage
    } else {
      setEditedData([...rubricaData]);
    }
    setIsEditing(false);
  };

  const handleInputChange = (index, field, value) => {
    const newEditedData = [...editedData];
    newEditedData[index][field] = value;
    setEditedData(newEditedData);
  };

  const onloadAlumnos = async () => 
    {
        try 
        {
          const response = await fetch('https://robe.host8b.me/WebServices/accionesAlumnos.php', 
            {
              method: 'POST',
              headers: 
              {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                clvMateria:vchClvMateria,
                matriculaDocent: userData.vchMatricula,
                chrGrupo: chrGrupo,
                periodo:intPeriodo
              }),
          });
          const result = await response.json();
          console.log("datoalumnos: ", result)
  
          if (result.done) 
          {
            setAlumnosMaterias(result.message);
          } 
          else 
          {
            console.error('Error en el registro:', result.message);
            if (result.debug_info) 
            {
              console.error('Información de depuración:', result.debug_info);
            }
            if (result.errors) 
            {
              result.errors.forEach(error => {
              console.error('Error específico:', error);
              });
            }
          }
        } 
        catch (error) 
        {
          console.error('Error 500', error);
          setTimeout(() => {
              alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.'); 
            }, 2000);
        } 
      };

  useEffect(() => {
    onloadAlumnos()
    const fetchActividad = async () => {
      const requestData = { idPracticaDetalle: intNumeroPractica };
      try {
        const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        console.log("datos rubrica: ",data);
        if (data.done) {
          setDetalleActividad(data.message.detallePractica);
          const fetchedRubricaData = data.message.detalleRubrica;
          setRubricaData(fetchedRubricaData);
          localStorage.setItem('rubricaData', JSON.stringify(fetchedRubricaData)); // Guardar en localStorage
          setEditedData(fetchedRubricaData);
        } else {
          throw new Error('Error al cargar los datos de la actividad');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchActividad();
  }, [intNumeroPractica]);

  useEffect(() => {
    // Usar rubricaData si no estamos editando, de lo contrario usar editedData
    const dataToSum = isEditing ? editedData : rubricaData;
    const total = dataToSum.reduce((sum, rubrica) => sum + (parseInt(rubrica.intValor) || 0), 0);
    setPuntajeTotal(total);
  }, [rubricaData, editedData, isEditing]);

  return (
    <section className='w-full flex flex-col'>
      <TitlePage label={detalleActividad.vchNombre} />
      <Paragraphs className="ml-3" label={detalleActividad.vchDescripcion} />
      <Tabs>
        <Tabs.Item title="Instrucciones" icon={MdDescription}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className='md:w-9/12 md:flex flex-col gap-y-4'>
              <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <TitleSection label="Instrucciones" />
                <Paragraphs label={detalleActividad.vchDescripcion} />
              </div>
              <div className="grid grid-cols-1 gap-1 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <div className="flex justify-between items-center">
                  <TitleSection label="Rúbrica de Evaluación" />
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Tooltip content="Guardar" placement="left">
                        <FaSave className="text-gray-500 cursor-pointer" onClick={handleSaveClick} />
                      </Tooltip>
                      <Tooltip content="Cancelar" placement="left">
                        <FaTimes className="text-gray-500 cursor-pointer" onClick={handleCancelClick} />
                      </Tooltip>
                    </div>
                  ) : (
                    <Tooltip content="Editar" placement="left">
                      <FaEdit className="text-gray-500 cursor-pointer" onClick={handleEditClick} />
                    </Tooltip>
                  )}
                </div>
                {editedData.map((rubrica, index) => (
                  <div key={index} className="space-y-4">
                    <div className="grid grid-cols-2 items-center">
                      <div className="text-muted-foreground">
                        {isEditing ? (
                          <CustomInputOnchange
                            label={`Rubro ${index + 1}`}
                            type="text"
                            name={`vchRubro_${index}`}
                            value={rubrica.vchDescripcion || ''}
                            errors={errors}
                            register={register}
                            trigger={trigger}
                            onChange={(value) => handleInputChange(index, 'vchDescripcion', value)}
                          />        
                        ) : (
                          <p>{rubrica.vchDescripcion}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <CustomInputOnchange
                            label={`Valor ${index + 1}`}
                            type="number"
                            name={`intValor_${index}`}
                            value={rubrica.intValor || ''}
                            pattern={/^[0-9]+$/} // Asegúrate de usar un regex válido
                            errorMessage="El valor debe ser un número"
                            errors={errors}
                            register={register}
                            trigger={trigger}
                            onChange={(value) => handleInputChange(index, 'intValor', value)}
                          />        
                        ) : (
                          <span className="font-semibold">{rubrica.intValor}</span>
                        )}
                        {isAuthenticated && userData.roles == null && !isEditing && (
                          <span className="text-muted-foreground">/{rubrica.intValor}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-muted-foreground">Puntaje Total</div>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && userData.roles == null && (
                      <span className="text-muted-foreground">{puntajeTotal}</span>
                    )}
                    <span className="font-semibold text-2xl">{puntajeTotal}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/4 md:flex flex-col">
              <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <TitleSection label="Tu Trabajo" />
                <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                        Subir Archivo
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        name="file-upload"
                        className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm max-sm:w-full md:w-full"
                      />
                    </div>
                    <LoadingButton normalLabel="Entregar" className="mt-4 w-full text-white py-2 px-4 rounded-lg" />
                  </div>
                </address>
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Trabajos de los Alumnos" icon={MdAssignment}>
        <div className="flex flex-col md:flex-row gap-4">
            <div className='md:w-5/12 md:flex flex-col gap-y-4'>
              <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <TitleSection label="Alumnos" />
                {alumnos.map((alumnos) => (
                  <Paragraphs label={`${alumnos.AlumnoMatricula} ${alumnos.AlumnoNombre} ${alumnos.AlumnoApellidoPaterno} ${alumnos.AlumnoApellidoMaterno}`} />
                ))}
              </div>
            </div>
            <div className="md:w-7/12 md:flex flex-col">
              <div className="h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <TitleSection label="Calificacion de Rúbrica" />
                {/*
                <div className="flex flex-col items-end justify-start min-h-0">
                  <div className="p-6 w-full max-w-xs">
                    <h2 className="text-xl font-medium text-center mb-4">Contador de Tareas</h2>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg flex justify-between items-center border">
                        <span>Entregadas</span>
                        <span className="text-lg font-semibold">0</span>
                      </div>
                      <div className="p-4 rounded-lg flex justify-between items-center border">
                        <span>Asignadas</span>
                        <span className="text-lg font-semibold">6</span>
                      </div>
                      <div className="p-4 rounded-lg flex justify-between items-center border">
                        <span>Calificadas</span>
                        <span className="text-lg font-semibold">0</span>
                      </div>
                    </div>
                  </div>
                </div>*/}
              </div>
            </div>
          </div>
        </Tabs.Item>
      </Tabs>
    </section>
  );
};
export default DetallePractica;
