import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './assets/components/Layout';
import HomePage from './assets/pages/HomePage';
import LoginPage from './assets/pages/LoginPage';
import RegisterPage from './assets/pages/RegisterPage';
import BusquedaAvanzada from './assets/pages/Admin/BusquedaAvanzada';
//import ResultadosCalificacioness from './assets/pages/ResultadosCalificacioness';
import EmailForm from './assets/pages/EmailForm';
import ResetPassword from './assets/pages/ResetPassword';
import ResetPasswordCode from './assets/pages/ResetPasswordCode';
import AdminHome from './assets/pages/Admin/AdminHome';
import Error404 from './assets/pages/Error404';
import ProfilePage from './assets/pages/ProfileUser';
import { AuthProvider, useAuth } from './assets/server/authUser';
import AgregarAlumnos from './assets/pages/Docentes/AddStudents';
import Docentes from './assets/pages/Docentes/Teachers';
import MateriasAlum from './assets/pages/Admin/Mate';
import Materias from './assets/pages/Docentes/MateriasDocente';
import DetalleMateria from './assets/pages/Docentes/detalleMateria';
import DetalleMateriaAlumno from './assets/pages/detalleMaterias';
import GruposMaterias from './assets/pages/Docentes/gruposMaterias';
import DetalleActividad from './assets/pages/Docentes/DetalleActividad';
import Laplace from './assets/pages/Admin/Laplace';
import MyCalendar from './assets/pages/Calendar';
import ResultadosCalificaciones from './assets/pages/ResultadosCalificaciones';
import Notificaciones from './assets/pages/Notificaciones';
import DetallePractica from './assets/pages/Docentes/DetallePractica';
import PrivacyPolicy from './assets/pages/Terminos';

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
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/login" element={<IsAuthenticated><LoginPage/></IsAuthenticated>} />
          <Route path="/Terminos" element={<Layout><PrivacyPolicy/></Layout>} />
          <Route path="/register" element={<IsAuthenticated><RegisterPage /></IsAuthenticated>} />
          <Route path="/BusquedaAvanzada" element={<Layout><BusquedaAvanzada /></Layout>} />
          <Route path="/recover-password" element={<Layout><EmailForm /></Layout>} />
          <Route path="/Materias" element={<Layout><MateriasAlum /></Layout>} />
          <Route path="/calendario-actividades" element={<Layout><MyCalendar/></Layout>} />
          <Route path="/restablecer-contrasena/:matricula/:token/" element={<Layout><ResetPassword /></Layout>} />
          <Route path="/reset-password-code/:codigo/" element={<Layout><ResetPasswordCode/></Layout>} />
          <Route path="/ProfilePage/" element={<PrivateRouteUser><Layout><ProfilePage/></Layout></PrivateRouteUser>} />
          <Route path="/Notificaciones/" element={<Layout><Notificaciones/></Layout>} />
          <Route path="/Admin/" element={<Layout><AdminHome/></Layout>} />
          <Route path="/ResultadosCalificaciones" element={<PrivateRoute><Layout><ResultadosCalificaciones/></Layout></PrivateRoute>} />
          <Route path="/Admin/Students" element={<PrivateRoute><Layout><AgregarAlumnos/></Layout></PrivateRoute>} />
          <Route path="/Admin/Teachers" element={<Layout><Docentes/></Layout>} />
          <Route path="/Admin/Laplace" element={<Layout><Laplace/></Layout>} />
          <Route path="/Materias/detalleMateria/:vchClvMateria/:chrGrupo/:intPeriodo" element={<Layout><DetalleMateriaAlumno/></Layout>} />
          <Route path="/Admin/Materias" element={<Layout><Materias/></Layout>} />
          <Route path="/Admin/Materias/gruposMaterias/:vchClvMateria/:intPeriodo" element={<Layout><GruposMaterias/></Layout>} />
          <Route path="/Admin/Materias/detalleMateria/:vchClvMateria/:chrGrupo/:intPeriodo" element={<Layout><DetalleMateria/></Layout>} />
          <Route path="/Admin/Materias/detalleActividad/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi" element={<Layout><DetalleActividad/></Layout>} />
          <Route path="/Admin/Detalle/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intNumeroPractica" element={<Layout><DetallePractica/></Layout>} />
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
