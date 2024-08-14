import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Tabs, Accordion } from "flowbite-react";
import { HiClipboardList, HiUserGroup } from "react-icons/hi"; // Actualiza aquí
import Components from '../../components/Components';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const { TitlePage, ContentTitle, Paragraphs, Link, TitleSection } = Components;

const DetalleMateria = () => {
  const { userData } = useAuth(); // Obtén el estado de autenticación del contexto
  const [actividades, setActividades] = useState([]);
  const [alumnos, setAlumnosMaterias] = useState([]);
  const { vchClvMateria, chrGrupo, intPeriodo } = useParams();
  const [loading, setLoading] = useState(false);

  const onloadActividades = async () => {
    try {
      const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clvMateria: vchClvMateria,
          matriculaDocent: userData.vchMatricula,
          chrGrupo: chrGrupo,
          periodo: intPeriodo,
        }),
      });

      const requestData = {
        clvMateria: vchClvMateria,
        matriculaDocent: userData.vchMatricula,
        chrGrupo: chrGrupo,
        periodo: intPeriodo,
      };

      console.log("datods: ", requestData)
      const result = await response.json();
      console.log(result);

      if (result.done) {
        setActividades(result.message);
      } else {
        console.error('Error en el registro:', result.message);
        if (result.debug_info) {
          console.error('Información de depuración:', result.debug_info);
        }
        if (result.errors) {
          result.errors.forEach(error => {
            console.error('Error específico:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error 500', error);
      setTimeout(() => {
        alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
      }, 2000);
    }
  };

  const onloadAlumnos = async () => {
    try {
      const response = await fetch('https://robe.host8b.me/WebServices/accionesAlumnos.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clvMateria: vchClvMateria,
          matriculaDocent: userData.vchMatricula,
          chrGrupo: chrGrupo,
          periodo: intPeriodo,
        }),
      });
      const result = await response.json();
      console.log("datoalumnos: ", result)

      if (result.done) {
        setAlumnosMaterias(result.message);
      } else {
        console.error('Error en el registro:', result.message);
        if (result.debug_info) {
          console.error('Información de depuración:', result.debug_info);
        }
        if (result.errors) {
          result.errors.forEach(error => {
            console.error('Error específico:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error 500', error);
      setTimeout(() => {
        alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
      }, 2000);
    }
  };

  useEffect(() => {
    onloadActividades();
    onloadAlumnos();
  }, []);

  const groupActivitiesByParcial = (activities) => {
    return activities.reduce((groups, activity) => {
      const { intParcial } = activity;
      if (!groups[intParcial]) {
        groups[intParcial] = [];
      }
      groups[intParcial].push(activity);
      return groups;
    }, {});
  };

  const groupedActivities = groupActivitiesByParcial(actividades);

  const fetchAndGenerateExcel = async () => {
    setLoading(true);

    try {
      // Fetch the data
      const response = await fetch('https://robe.host8b.me/WebServices/obtenerCalificacionesParcial.php');
      const result = await response.json();

      if (result.done) {
        // Prepare data for Excel
        const ws = XLSX.utils.json_to_sheet(result.message, {
          header: [
            'Matrícula', 'Nombre', 'P1', 'P2', 'P3', 'P4', 'P5', 'PF', 'ACTIVIDAD 8', 'ACTIVIDAD 7', 'Cal Final'
          ]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones');

        // Convert to buffer and save as Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(file, 'calificaciones.xlsx');
      } else {
        console.error('Error fetching data:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className='w-full flex flex-col'>
      <TitlePage label="Trabajo de clase" />
      <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Actividades" icon={HiClipboardList}>
            {Object.entries(groupedActivities).map(([parcial, activities]) => (
              <div key={parcial}>
                
                <TitleSection label={'Parcial '+ parcial} />
                <button onClick={fetchAndGenerateExcel} disabled={loading}>
                {loading ? 'Generando Excel...' : `Generar Excel ${'Parcial ' + parcial}`}
                </button>
                <Accordion collapseAll>
                  {activities.map((actividad) => (
                    <Accordion.Panel key={actividad.intClvActividad}>
                      <Accordion.Title>
                        <ContentTitle label={actividad.vchNomActivi} />
                      </Accordion.Title>
                      <Accordion.Content>
                        <Paragraphs label={actividad.vchDescripcion} />
                        <Paragraphs label={`Valor: ${actividad.fltValor} puntos`} />
                      </Accordion.Content>
                      <Accordion.Content>
                        <Link
                          to={`/Admin/Materias/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${actividad.intClvActividad}`}
                          children="Ver Más"
                        />
                      </Accordion.Content>
                    </Accordion.Panel>
                  ))}
                </Accordion>
              </div>
            ))}
          </Tabs.Item>
          <Tabs.Item title="Alumnos" icon={HiUserGroup}>
            <TitlePage label="Alumnos" />
            <div className="p-4">
              {alumnos.map((alumnos) => (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }} key={alumnos.AlumnoMatricula}>
                  <Paragraphs className="mb-0" label={`${alumnos.AlumnoMatricula} - ${alumnos.AlumnoNombre} ${alumnos.AlumnoApellidoPaterno} ${alumnos.AlumnoApellidoMaterno}`} />
                </div>
              ))}
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </section>
  );
};

export default DetalleMateria;
