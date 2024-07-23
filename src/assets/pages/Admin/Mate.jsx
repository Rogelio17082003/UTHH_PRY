// SideNav.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { Card, Button } from 'flowbite-react';

const MateriasAlum = () => { 
  const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
  const [materias, setMaterias] = useState([]);

  const onloadNaterias = async () => {
    try {

      const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matriculaAlumn: userData.vchMatricula
          }),
      });

      const result = await response.json();
  console.log(result);
      if (result.done) {
        setMaterias(result.message);

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
          setServerErrorMessage(result.message || 'Error en el servidor.');
      }
      
  } catch (error) {
      console.error('Error 500', error);
      setTimeout(() => {
          alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.'); 
        }, 2000);
  } finally {
      setIsLoading(false);
  }
  };

  useEffect(() => {
    {
      onloadNaterias()
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Materias Asociadas</h1>
      <div className="grid grid-cols-3 gap-4">

      {materias.map((materia) => (
        <Card
        key={materia.vchClvMateria}
        href={`/Materias/detalleMateria/${materia.vchClvMateria}/${userData.dataEstudiante.chrGrupo}/${materia.intPeriodo}`}
        className="max-w-sm rounded-lg overflow-hidden shadow-lg"
      >
        <div className="flex justify-end px-4 pt-4">
          {/* Aquí puedes agregar un menú desplegable si es necesario */}
        </div>
        <div className="flex flex-col items-center pb-6 px-4">
          <img alt="User settings" 
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
            className="w-24 h-24 rounded-full shadow-lg mb-3" 
            data-testid="flowbite-avatar-img"
          />
          
          <h3 className="mb-1 text-xl font-medium text-gray-900">{materia.vchNombre} {materia.vchAPaterno} {materia.vchAMaterno}</h3>
          <p className="text-sm text-gray-500">{materia.vchClvMateria}: {materia.vchNomMateria} {materia.intHoras} Horas</p>
          <p className="mt-1 text-sm text-gray-500">{materia.intClvCuatrimestre}{materia.chrGrupo}</p>
          {/* Supongo que "Carrera" debería mostrar la carrera relacionada a la materia */}
          <p className="mt-1 text-sm text-gray-500">
            <strong>Periodo:</strong> {materia.vchPeriodo}
          </p>
        </div>
      </Card>

        ))}
      </div>
    </div>
  );
};

export default MateriasAlum;
