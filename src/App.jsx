import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './assets/server/authUser';
import Layout from './assets/components/Layout';
import HomePage from './assets/pages/HomePage';
import LoginPage from './assets/pages/LoginPage';
import RegisterPage from './assets/pages/RegisterPage';
import ProfilePage from './assets/pages/ProfileUser';
import EmailForm from './assets/pages/EmailForm';
import ResetPassword from './assets/pages/ResetPassword';
import ResetPasswordCode from './assets/pages/ResetPasswordCode';
import PrivacyPolicy from './assets/pages/Terminos';
import Error404 from './assets/pages/Error404';
//PAGINAS ALUMNO
import ActividadesAlumno from './assets/pages/PaginasAlumnos/ActividadesAlumno';
import DetalleActividadAlumno from './assets/pages/PaginasAlumnos/DetalleActividadAlumno';
import DetallePracticaAlumno from './assets/pages/PaginasAlumnos/DetallePracticaAlumno';

//PAGINAS DOCENTE
import Docentes from './assets/pages/PaginasDocentes/Teachers';
import Alumnos from './assets/pages/PaginasDocentes/Alumnos';
import GruposMateriasDocente from './assets/pages/PaginasDocentes/GruposMateriaDocente';
import ActividadesDocente from './assets/pages/PaginasDocentes/ActividadesDocente';
import DetalleActividadDocente from './assets/pages/PaginasDocentes/DetalleActividadDocente';
import DetallePracticaDocente from './assets/pages/PaginasDocentes/DetallePracticaDocente';

// Importa los estilos de react-toastify
import 'react-toastify/dist/ReactToastify.css';
import './main'
// Importa el ToastContainer y el método toast
import { ToastContainer, toast } from 'react-toastify';

import './App.css';

function App() {
  return (
    /*          <Route path="/PushNotificationButton" element={<Layout><PushNotificationButton /></Layout>} /> */
    <AuthProvider>
      <Router>
        <Routes>
          {/*PAGINAS PARA TODOS */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/inicio-sesion" element={<IsAuthenticated><LoginPage/></IsAuthenticated>} />
          <Route path="/registro" element={<IsAuthenticated><RegisterPage /></IsAuthenticated>} />
          <Route path="/recuperar-contrasena" element={<Layout><EmailForm /></Layout>} />
          <Route path="/restablecer-contrasena/:matricula/:token/" element={<Layout><ResetPassword /></Layout>} />
          <Route path="/mi-perfil/" element={<PrivateRouteUser><Layout><ProfilePage/></Layout></PrivateRouteUser>} />
          <Route path="/reset-password-code/:codigo/" element={<Layout><ResetPasswordCode/></Layout>} />

          {/*PAGINAS PARA Alumnos */}
          <Route path="/actividades/:vchClvMateria/:chrGrupo/:intPeriodo" element={<PrivateRouteUser><Layout><ActividadesAlumno/></Layout></PrivateRouteUser>} />
          <Route path="/actividades/detalleActividad/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intIdActividadCurso" element={<PrivateRouteUser><Layout><DetalleActividadAlumno/></Layout></PrivateRouteUser>} />
          <Route path="/actividades/detalleActividad/detallePractica/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intNumeroPractica" element={<PrivateRouteUser><Layout><DetallePracticaAlumno/></Layout></PrivateRouteUser>} />
          {/*PAGINAS PARA Docentes */}
          <Route path="/alumnos" element={<PrivateRoute><Layout><Alumnos/></Layout></PrivateRoute>} />
          <Route path="/docentes" element={<PrivateRoute><Layout><Docentes/></Layout></PrivateRoute>} />
          <Route path="/Admin/Teachers" element={<Layout><Docentes/></Layout>} />
          <Route path="/gruposMaterias/:vchClvMateria/:intPeriodo" element={<PrivateRoute><Layout><GruposMateriasDocente/></Layout></PrivateRoute>} />
          <Route path="/gruposMaterias/actividades/:vchClvMateria/:chrGrupo/:intPeriodo" element={<PrivateRoute><Layout><ActividadesDocente/></Layout></PrivateRoute>} />
          <Route path="/gruposMaterias/actividades/detalleActividad/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intIdActividadCurso" element={<PrivateRoute><Layout><DetalleActividadDocente/></Layout></PrivateRoute>} />
          <Route path="/gruposMaterias/actividades/detalleActividad/detallePractica/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intNumeroPractica" element={<PrivateRoute><Layout><DetallePracticaDocente/></Layout></PrivateRoute>} />

          <Route path="/Terminos" element={<Layout><PrivacyPolicy/></Layout>} />
          <Route path="/*"element={<Layout><Error404/></Layout>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function IsAuthenticated({children}) {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Navigate to="/" /> : children;
}


function PrivateRoute({ children }) {
  const { isAuthenticated, userData } = useAuth();

  // Validación: Usuario no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Validación: Usuario autenticado pero sin rol
  if (isAuthenticated && !userData.intRol) {
    return <Navigate to="/" />;
  }

  // Si pasa la validación, muestra el contenido de la ruta
  return children;
}


function PrivateRouteUser({ children }) {
  const { isAuthenticated } = useAuth();

  // Validación: Usuario no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si pasa la validación, muestra el contenido de la ruta
  return children;
}


export default App;
