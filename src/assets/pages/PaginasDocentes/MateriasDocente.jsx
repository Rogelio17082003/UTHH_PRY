// SideNav.js
import React, { useState, useEffect } from 'react';

import {Table, Alert, Card} from 'flowbite-react';
import {IoMdAdd } from 'react-icons/io';
import {FaRegFrown } from 'react-icons/fa';
import {Button, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import  Components from '../../components/Components'
const {IconButton, LoadingButton, TitlePage, Paragraphs, InfoAlert, LoadingOverlay} = Components;
import {useAuth } from '../../server/authUser'; // Importa el hook de autenticación

const MateriasDocente = () => { 
    const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
    const [materias, setMaterias] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [header, setHeader] = useState([]);
    const [info, setInfo] = useState({});
    const [serverResponse, setServerResponse] = useState('');
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFile(event);
        if (!file) return;
    
        const reader = new FileReader();
    
        reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
    
        const allData = [];
        const headers = [];
        let allActivities = [];
    
        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
            console.log(`Parsed Data for sheet ${sheetName}:`, parsedData);
    
            if (parsedData.length > 0) {
            allData.push({ sheetName, data: parsedData });
    
            const gradoYgrupo = parsedData[10][7];
            const firstDate = parsedData[10][1];
            const { period, partial } = determinePeriod(firstDate);
    
            console.log("gradoygru", gradoYgrupo);
            const [grado, grupo] = extractGradoYGrupo(gradoYgrupo);
    
            const infoData = {
                carrera: parsedData[6][0],
                docente: parsedData[8][2],
                materia: parsedData[9][1],
                grado: grado,
                grupo: grupo,
                periodo: period,
                parcial: partial,
            };
    
            console.log('Extracted Info:', infoData);
            setInfo(infoData);
    
            if (parsedData[12]) {
                const headerRow = [];
                parsedData[12].forEach((cell, index) => {
                const cellAddress = XLSX.utils.encode_cell({ r: 12, c: index });
                const merge = (sheet['!merges'] || []).find(
                    (merge) => merge.s.c === index && merge.s.r === 12
                );
                if (merge) {
                    const colspan = merge.e.c - merge.s.c + 1;
                    for (let i = 0; i < colspan; i++) {
                    headerRow.push(cell);
                    }
                } else {
                    headerRow.push(cell);
                }
                });
                headers.push({ sheetName, header: headerRow });
            }
    
            const activityData = extractActivityData(parsedData);
            allActivities = [...allActivities, ...activityData];
            }
        });
        console.log(allData)
        setData(allData);
        setHeader(headers);
        setActividades(allActivities);
        console.log(allActivities)

        };
    
        reader.readAsBinaryString(file);
    };

    const formatDate = (excelDate) => {
        const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    const extractGradoYGrupo = (gradoYgrupo) => {
        const match = gradoYgrupo.match(/(\d+)\s*°\s*"([A-Za-z])"/);
    
        if (match) {
        let grado = match[1];
        let grupo = match[2];
        
        // Elimina el 0 inicial del grado si está presente
        if (grado.startsWith('0')) {
            grado = grado.slice(1);
        }
    
        return [grado, grupo];
        }
        return ['', ''];
    };

    const determinePeriod = (monthYear) => {
        const [month, year] = monthYear.split('/').map(Number);
    
        let period;
        let partial;
    
        if (month >= 9 && month <= 12) {
        period = `${year}${3}`;
        } else if (month >= 1 && month <= 4) {
        period = `${year}${1}`;
        } else if (month >= 5 && month <= 8) {
        period = `${year}${2}`;
        }
    
        if (month >= 1 && month <= 4) {
        partial = `${month}`;
        } else if (month >= 5 && month <= 8) {
        partial = `${month - 4}`;
        } else if (month >= 9 && month <= 12) {
        partial = `${month - 8}`;
        }
    
        return { period, partial };
    };

    const extractActivityData = (parsedData) => {
        const activityData = [];
        let totalPuntuacion = 0;
    
        for (let i = 14; i < parsedData.length; i++) {
            if (parsedData[i][0] === 'Subtotal') {
                break; // Detener la lectura cuando se encuentre "Subtotal"
            }
            if (i % 9 === 14 % 9) {
                const puntuacion = parseFloat(parsedData[i][3]); // Asegúrate de convertir a número
                
                if (totalPuntuacion + puntuacion > 10) {
                    console.error("No se puede agregar la actividad: " + parsedData[i][0] + ". La suma de las puntuaciones excede 10.");
                    break; // Detén la iteración si la suma excede 10
                }
    
                totalPuntuacion += puntuacion; // Sumar la puntuación solo si no excede 10
    
                const activity = {
                    actividad: parsedData[i][0],
                    descripcion: parsedData[i + 1] ? parsedData[i + 1][0] : '',
                    puntuacion: puntuacion,
                    tiempoEstimado: parsedData[i + 6] ? parsedData[i + 6][2] : '',
                    modalidad: parsedData[i + 7] ? parsedData[i + 7][2] : '',
                    instrumento: parsedData[i + 8] ? parsedData[i + 8][2] : '',
                    fechaSolicitud: formatDate(parsedData[i][6]),
                    fechaEntrega: formatDate(parsedData[i][7]),
                };
    
                activityData.push(activity);
            }
        }
    
        // Validar si la suma de las puntuaciones es exactamente 10
        if (totalPuntuacion !== 10) {
            
            alert("La suma de las puntuaciones debe ser igual a 10. La suma actual es: " + totalPuntuacion);
            return []; // Retornar un arreglo vacío si la suma no es 10
        }
    
        return activityData; // Retornar los datos de actividad si la suma es 10
    };
    

    const handleClickRegistrar = () => {
        registrarEstudiantes(actividades);
    };

    const registrarEstudiantes = async () => 
    {
        const actividadesData = actividades.map((activity, index) => {
            return {
            docente: userData.vchMatricula,
            carrera: info.carrera,
            materia: info.materia,
            periodo: info.periodo,
            grado: info.grado,
            grupo: info.grupo,
            parcial: info.parcial,
            noActividad: index + 1,
            nomActividad: activity.actividad,
            intPuntuacion: activity.puntuacion,
            dtmSolicitud: activity.fechaSolicitud,
            ttmEntrega: activity.fechaEntrega,
            vchDescripcion: activity.descripcion,
            intTiempo: activity.tiempoEstimado,
            enumModalidad: activity.modalidad,
            clvinstrumento: activity.instrumento
            };
        });
        console.log("datos", actividadesData)
        try 
        {
            setIsLoading(true);
            const response = await fetch('https://robe.host8b.me/WebServices/InsertarActividades.php',
                {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify
                ({
                    dataActividades: actividadesData,
                }),
                }
            );
            const result = await response.json();
            setActividades([]);
            if (result.done) 
            {
                onloadNaterias(); // Llamar a la función para recargar las materias
                setServerResponse(`Éxito: ${result.message}`);
                console.log('Datos recibidos php:', result);
            }
            else
            {
                setServerResponse(`Error: ${result.message}`);                
                console.log('Datos recibidos php:', result);
            }
        } 
        catch (error) 
        {
            setServerResponse(`Error: ${result.message}`);
            console.error(error);
        }
        finally 
        {
            setIsLoading(false);
            setOpenModal(false)
            setFile(null);
        }
    };

    const onloadNaterias = async () => 
        {
        try 
        {
            setIsLoadingPage(true);

            const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                matriculaDocent: userData.vchMatricula
                }),
            });
            const result = await response.json();
            if (result.done) 
            {
                setMaterias(result.message);
            } 
            else 
            {
            console.log('Error en el registro:', result.message);
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
            setIsLoadingPage(false);
        }
    };

    

    useEffect(() => 
    {
        {
            onloadNaterias()
        }
    }, []);

    return (
    <div className="container mx-auto px-4 py-8">
        <LoadingOverlay isLoading={isLoadingPage} />

        <InfoAlert
            message={serverResponse}
            type={serverResponse.includes('Éxito') ? 'success' : 'error'}
            isVisible={!!serverResponse}
            onClose={() => {
            setServerResponse('');
            }}
            hasDuration={false} // El alert permanecerá visible hasta que el usuario lo cierre
        />

        <Modal className='h-0 mt-auto pt-16' size="4xl" show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Agregar Materias</Modal.Header>
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
                            <div className="mt-4">Carrera:</div>
                            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {info.carrera}
                            </div>
                        </div>
                        <div className="fle-row">
                        <div className="mt-4">Materia:</div>
                            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {info.materia}
                            </div>
                        </div>
                        <div className="fle-row">
                        <div className="mt-4">Periodo:</div>
                            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {info.periodo}
                            </div>
                        </div>
                        <div className="fle-row">
                        <div className="mt-4">Grado:</div>
                            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {info.grado}
                            </div>
                        </div>
                        <div className="fle-row">
                        <div className="mt-4">Grupo:</div>
                            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {info.grupo}
                            </div>
                        </div>
                        <div className="fle-row">
                        <div className="mt-4">Parcial:</div>
                            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {info.parcial}
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                        <Table.HeadCell>No</Table.HeadCell>
                        <Table.HeadCell>Actividad</Table.HeadCell>
                        <Table.HeadCell>Descripción</Table.HeadCell>
                        <Table.HeadCell>Puntuacion</Table.HeadCell>
                        <Table.HeadCell>Tiempo estimado</Table.HeadCell>
                        <Table.HeadCell>Modalidad</Table.HeadCell>
                        <Table.HeadCell>Instrumento</Table.HeadCell>
                        <Table.HeadCell>Fecha Solicitud</Table.HeadCell>
                        <Table.HeadCell>Fecha de Entrega</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                        {data.map((sheet, sheetIndex) => {
                            const activityData = extractActivityData(sheet.data);
                            return activityData.map((actividad, index) => (
                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{actividad.actividad}</Table.Cell>
                            <Table.Cell>{actividad.descripcion}</Table.Cell>
                            <Table.Cell>{actividad.puntuacion}</Table.Cell>
                            <Table.Cell>{actividad.tiempoEstimado}</Table.Cell>
                            <Table.Cell>{actividad.modalidad}</Table.Cell>
                            <Table.Cell>{actividad.instrumento}</Table.Cell>
                            <Table.Cell>{actividad.fechaSolicitud}</Table.Cell>
                            <Table.Cell>{actividad.fechaEntrega}</Table.Cell>
                            </Table.Row>
                            ))
                        })}
                        </Table.Body>
                    </Table>
                    </div>
                </section>
                )}
            </div>
            </Modal.Body>
            {actividades.length > 0 && (
            <Modal.Footer>
                <LoadingButton
                    onClick={handleClickRegistrar} 
                    isLoading={isLoading}
                    className="max-w-32 max-h-11" 
                    loadingLabel="Cargando..."
                    normalLabel="Agregar"
                />
                <Button color="gray" onClick={() => {setOpenModal(false); setFile(null)}}>
                    Cancelar
                </Button>
            </Modal.Footer>
            )}
        </Modal>
        
        <div className="flex items-center m-2">
            <IconButton
                className="ml-2 button"
                Icon={IoMdAdd} // Pasa el componente de ícono
                message="Añadir Materias con actividades"
                onClick={() => setOpenModal(true)}
            />
        </div>

        <TitlePage label="Materias Asociadas" />
        {materias.length > 0 ? 
        (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {materias.map((materia) => (
                <Card
                key={materia.vchClvMateria}
                href={`/gruposMaterias/${materia.vchClvMateria}/${materia.intPeriodo}`}
                className="rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
                theme={{
                    root: {
                    children: "p-0",
                    }
                }}
                >
                <div className="relative h-60">
                    <div className="bg-gray-200 p-2 h-1/2 flex flex-col items-center justify-center">
                    <div className="relative w-full flex justify-center">
                        {/* Puedes agregar algo aquí si lo necesitas */}
                    </div>
                    </div>
                    <div className="pt-5 pb-6 px-4">
                    <h3 className="text-xl font-bold text-gray-900 text-center">{materia.vchNomMateria}</h3>
                    <p className="text-sm text-gray-500 text-center">{materia.vchClvMateria}: {materia.vchNomMateria} {materia.intHoras}</p>
                    <p className="text-sm text-gray-500 text-center">{materia.NombreCuatrimestre}</p>
                    <p className="mt-1 text-sm text-gray-500 text-center">
                        <strong>Periodo:</strong> {materia.NombrePeriodo}
                    </p>
                    </div>
                </div>
                </Card>
            ))}
            </div>
        ) 
        : 
        (
            <div className="flex flex-col items-center justify-center h-64">
            <FaRegFrown className="text-gray-500 text-6xl" />
            <Paragraphs label="No hay clases agregadas. Añade una clase para empezar." />
            </div>
        )}
    </div>
    );
};

export default MateriasDocente;