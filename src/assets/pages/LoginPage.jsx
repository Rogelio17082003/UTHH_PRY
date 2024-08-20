import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Checkbox, Label } from 'flowbite-react';
import ReCAPTCHA from 'react-google-recaptcha';
import Components from '../components/Components';
import { useAuth } from '../server/authUser'; 
import imagePanel from '../images/uthhPanel.png';
import secondaryLogo from '../images/secondary-logo.png';

const {TitlePage, Paragraphs, LoadingButton, CustomInput, CustomInputPassword, InfoAlert } = Components;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const captcha = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [captchaValidado, setCaptchaValidado] = useState(false);
  const [captchaValidationError, setCaptchaValidationError] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloquearBoton, setBloquearBoton] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onCaptchaChange = () => {
    if (captcha.current.getValue()) {
      setCaptchaValidationError('');
      setCaptchaValidado(true);
    } else {
      setCaptchaValidationError('Por favor, completa la validación del captcha.');
      setCaptchaValidado(false);
    }
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      if (!captchaValidado) {
        setCaptchaValidationError('Por favor, completa la validación del captcha.');
        return;
      }

      const response = await fetch('https://robe.host8b.me/WebServices/loginUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, matriculaAlum: data.matriculaAlum.toString() }),
      });

      const result = await response.json();

      if (result.done) {
        login(result.userData.JWTUser, result.userData);

        await fetch('https://robe.host8b.me/WebServices/Logs/LogInicioSesion.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, matriculaAlum: data.matriculaAlum.toString() }),
        });

        navigate('/');
      } else {
        handleFailedLogin();
        setServerErrorMessage(result.message || 'Error en el servidor.');
      }
    } catch (error) {
      console.error('Error 500', error);
      alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailedLogin = async () => {
    setIntentosFallidos((prev) => prev + 1);
    if (intentosFallidos >= 2) { // Use >= 2 to block on the 3rd attempt
      alert('El login ha sido suspendido por 30 segundos');
      setBloquearBoton(true);

      await fetch('https://robe.host8b.me/WebServices/Logs/LogBloqueo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, matriculaAlum: data.matriculaAlum.toString() }),
      });

      setTimeout(() => {
        setIntentosFallidos(0);
        setBloquearBoton(false);
      }, 30000); // 30 segundos
    }
  };

  const onSubmit = (data, event) => {
    event.preventDefault();
    handleLogin(data);
  };

  return (
    <div>
      <InfoAlert
        message={serverErrorMessage || captchaValidationError}
        type="error"
        isVisible={!!serverErrorMessage || !!captchaValidationError}
        onClose={() => {
          setServerErrorMessage('');
          setCaptchaValidationError('');
        }}
      />

      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
          <img className="w-full h-auto lg:h-full object-cover object-center" src={imagePanel} alt="illustration" />
        </div>
        <div className="lg:w-1/2 bg-white p-8 flex-col flex items-center justify-center">
          <img className="w-20 mb-4" src={secondaryLogo} alt="logo" />
          <TitlePage label={"Bienvenido de vuelta"}/>
          <Paragraphs label={"Empieza donde lo dejaste, inicia sesión para continuar."}/>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#009944' }}></h1>
          {/*<p className="text-sm text-gray-600 mb-4">
            Inicie su sitio web en segundos. ¿No tienes una cuenta?{' '}
            <a href="/registro" style={{ color: '#009944' }}>Inscribirse</a>
          </p>*/}
          <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              label="Matrícula"
              name="matriculaAlum"
              pattern={/^\d+$/}
              errorMessage="Solo números y sin espacios"
              errors={errors}
              register={register}
              trigger={trigger}
            />
            <div className="mb-6 relative">
              <CustomInputPassword
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                name="password"
                errorMessage="No cumples con el patrón de contraseña"
                errors={errors}
                register={register}
                trigger={trigger}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-4 flex items-center"
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">Acuérdate de mí</label>
              </div>
              <a href="/recuperar-contrasena" style={{ color: '#23262d' }}>¿Olvidaste tu contraseña?</a>
            </div>
            <LoadingButton
              isLoading={isLoading}
              loadingLabel="Cargando..."
              normalLabel="Iniciar Sesión"
              disabled={bloquearBoton}
            />
            <div className='reCaptcha'>
              <ReCAPTCHA
                ref={captcha}
                sitekey="6LdUThYqAAAAABBrLId4dN3DOod7byAUSYHAUW7m"
                onChange={onCaptchaChange}
              />
            </div>
            {/*
            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="agree" />
              <Label htmlFor="agree" className="flex">
                Estoy de acuerdo con el&nbsp;
                <a href="/login" className="dark:text-cyan-500 hover:text-cyan-700 hover:underline">Términos y condiciones</a>
              </Label>
            </div>*/}
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
