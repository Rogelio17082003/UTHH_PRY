import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  Components from '../../components/Components'
const {TitlePage, ContentTitle, Paragraphs, TitleSection, LoadingButton, SelectInput, FloatingLabelInput} = Components;
import {Card} from 'flowbite-react';
import { FaRegFrown } from 'react-icons/fa';

const DetalleActividadAlumno = () => {
    const { vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, intIdActividadCurso } = useParams();
    const [actividad, setActividad] = useState([]);
    const [practicas, setPracticas] = useState([]);

    const fetchActividad = async () => 
        {
        const requestData = 
        {
            clvMateria: vchClvMateria,
            grupo: chrGrupo,
            periodo: intPeriodo,
            numeroActividad: intNumeroActi,
            numeroActividadCurso: intIdActividadCurso
        };

        try 
        {
            const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', 
            {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("Respuesta", data);

            if (data.done) 
            {
            setActividad(data.message.detalleActividad);
            setPracticas(data.message.practicasActividad);
            }
            else{

                console.log(data);
            }
        } catch (error) {
            console.error('Error: Error al cargar los datos de la actividad');
            // Manejar el error, mostrar mensaje al usuario, etc.
        }
        };
        
    useEffect(() => {
        fetchActividad();
    }, [vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, ]);

    return (
        <section className='w-full flex flex-col'>
        <div className="m-3 flex flex-col">
            <TitlePage label={actividad.Nombre_Actividad} />
            <Paragraphs label={actividad.Descripcion_Actividad} />
        </div>
        <div className="flex flex-col md:flex-row">
            <div className="container mx-auto mb-4 md:mb-0">
            <>
            {practicas ? (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {practicas.map((practica) => (
                    <Card
                    key={practica.idPractica}
                    href={`/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${practica.idPractica}`}
                    className="rounded-lg overflow-hidden shadow-lg p-0"
                    theme={{ root: { children: "p-0" } }}
                    >
                    <div className="relative h-36">
                        <div className="pt-5 pb-6 px-4">
                        <h3 className="text-xl font-bold text-gray-900 text-center">{practica.vchNombre}</h3>
                        <p className="text-sm text-gray-500 text-center">{practica.vchDescripcion}</p>
                        </div>
                    </div>
                    </Card>
                ))}
                </section>
            ) : (
                <section className="flex flex-col items-center justify-center w-full h-64">
                <FaRegFrown className="text-gray-500 text-6xl" />
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No hay actividades o prácticas disponibles.
                </div>
                </section>
            )}
            </>
            </div>
            <div className='md:w-1/3 md:ml-4 flex flex-col gap-y-4'>
            <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <TitleSection label="Detalles de la Actividad" />
                <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400 mt-3">
                <div>
                    <ContentTitle label="Fecha de Solicitud: " />
                    <Paragraphs label={actividad.Fecha_Solicitud} />
                </div>
                <div>
                    <ContentTitle label="Fecha de Entrega: " />
                    <Paragraphs label={actividad.Fecha_Entrega} />
                </div>
                <div>
                    <ContentTitle label="Valor de la Actividad: " />
                    <Paragraphs label={actividad.Valor_Actividad} />
                </div>
                <div>
                    <ContentTitle label="Clave de Instrumento:" />
                    <Paragraphs label={actividad.Clave_Instrumento} />
                </div>
                <div>
                    <ContentTitle label="Modalidad:" />
                    <Paragraphs label={actividad.Modalidad} />
                </div>
                </address>
            </section>
            </div>
        </div>
        </section>
    );
};

export default DetalleActividadAlumno;
