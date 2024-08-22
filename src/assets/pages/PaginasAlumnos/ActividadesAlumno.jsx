import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Tabs, Accordion } from "flowbite-react";
import { HiClipboardList, HiUserGroup } from "react-icons/hi"; // Actualiza aquí
import Components from '../../components/Components';
const { TitlePage, ContentTitle, Paragraphs, Link, TitleSection, DescriptionActivity } = Components;

const ActividadesAlumno = () => {
    const { userData } = useAuth(); // Obtén el estado de autenticación del contexto
    const [actividades, setActividades] = useState([]);
    const [alumnos, setAlumnosMaterias] = useState([]);
    const {vchClvMateria, chrGrupo, intPeriodo } = useParams();
    

    const onloadActividades = async () => {
        try {
        const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intClvCarrera:userData.dataEstudiante.intClvCarrera,
                intMateria: vchClvMateria,
                intPeriodo: userData.dataEstudiante.intPeriodo,
                intClvCuatrimestre:userData.dataEstudiante.intClvCuatrimestre,
                chrGrupo: userData.dataEstudiante.chrGrupo
            }),
        });

        const requestData = {
            intClvCarrera:userData.dataEstudiante.intClvCarrera,
            intMateria: vchClvMateria,
            intPeriodo: userData.dataEstudiante.intPeriodo,
            intClvCuatrimestre:userData.dataEstudiante.intClvCuatrimestre,
            chrGrupo: userData.dataEstudiante.chrGrupo
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
            chrGrupo: userData.dataEstudiante.chrGrupo,
            intPeriodo: userData.dataEstudiante.intPeriodo,
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

    return (
        <section className='w-full flex flex-col'>
        <TitlePage label="Trabajo de clase" />
        <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
            <Tabs aria-label="Tabs with underline" style="underline">
            <Tabs.Item active title="Actividades" icon={HiClipboardList}>
                {Object.entries(groupedActivities).map(([parcial, activities]) => (
                <div key={parcial}>
                    <TitleSection label={'Parcial '+ parcial} />
                    <Accordion collapseAll>
                    {activities.map((actividad) => (
                        <Accordion.Panel key={actividad.intClvActividad}>
                        <Accordion.Title>
                            <ContentTitle label={actividad.vchNomActivi} />
                        </Accordion.Title>
                        <Accordion.Content>
                            <DescriptionActivity label={actividad.vchDescripcion}/>
                            <Paragraphs label={`Valor: ${actividad.fltValor} puntos`} />
                        </Accordion.Content>
                        <Accordion.Content>
                            <Link
                            to={`/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${actividad.intClvActividad}/${actividad.intIdActividadCurso}`}
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

export default ActividadesAlumno;
