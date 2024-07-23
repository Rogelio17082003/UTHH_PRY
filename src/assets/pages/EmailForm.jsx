import React, { useState } from 'react';
import { Label, Select } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { Button, Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import Components from '../components/Components';
const { CustomInput, LoadingButton } = Components;
import { useNavigate } from 'react-router-dom';

const EmailForm = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isToggled, setToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    const inputCode = e.target.value.replace(/\D/g, ''); // Solo permite dígitos
    setCode(inputCode.slice(0, 5)); // Limita la longitud del código a 5 dígitos
  };
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch('https://robe.host8b.me/WebServices/correo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: data.correo,
          estado: isToggled,
          telefono: data.telefono,
        }),
      });

      const result = await response.json();
console.log(result);
      if (result.done) {
        setServerError(`Solicitud de recuperación de contraseña enviada con éxito. ${result.message}`);
        setEmailSent(true);
      } else {
        setServerError(`Error: ${result.message}`);
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
      console.error('Error:', error);
      setServerError('Error en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCode = async (data, event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch('https://robe.host8b.me/WebServices/restablecer-contrasena.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: data.codigo,
        }),
      });

      const result = await response.json();
console.log(response);
console.log(result);

      if (result.done) {
        setServerError(`Solicitud de recuperación de contraseña enviada con éxito. ${result.message}`);
        navigate(`/reset-password-code/${data.codigo}`);
      } else {
        setServerError(`Error: ${result.message}`);
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
      console.error('Error:', error);
      setServerError('Error en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setToggled(!isToggled);
  };

  return (
    <div className='ml-7 mr-7'>
      {!emailSent ? (
        <section className="min-h-screen flex items-center justify-center">
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {serverError && (
              <Alert className="flex items-center justify-center mb-4" color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Info alert!</span> {serverError}
              </Alert>
            )}
            <div className="w-full max-w-md">
              <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white">Recuperar Contraseña</h1>
              <div className="max-w-md mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="countries" value="Selecciona un método" />
                </div>
                <Select id="countries" required onChange={handleToggle}>
                  <option value="email">Recuperar por Correo Electrónico</option>
                  <option value="sms">Recuperar por Mensaje SMS</option>
                </Select>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {isToggled ? 'Ingresa tu telefono y te enviaremos un código para restablecer tu contraseña.' : 'Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'}
              </p>
            </div>
            <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
              {isToggled ? (
                <CustomInput
                  label="Telefono"
                  name="telefono"
                  pattern={/^\d+$/}
                  errorMessage="Solo números y sin espacios"
                  errors={errors}
                  register={register}
                  trigger={trigger}
                />
              ) : (
                <CustomInput
                  label="Correo Electrónico"
                  name="correo"
                  pattern={/^\d{8}@uthh\.edu\.mx$/}
                  errorMessage="El correo no es valido para la institución"
                  errors={errors}
                  register={register}
                  trigger={trigger}
                />
              )}
              <LoadingButton
                isLoading={isLoading}
                loadingLabel="Enviando..."
                normalLabel={!isToggled ? "Enviar Correo de Recuperación" : "Enviar Codigo por SMS"}
              />
            </form>
          </div>
        </section>
      ) : (
        <section className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <Alert className="flex items-center justify-center" color="success" icon={HiInformationCircle}>
              <span className="font-medium">Correo Enviado!</span> Hemos enviado un enlace de recuperación a tu correo electrónico.
            </Alert>
          </div>
        </section>
      )}
      {/* Mostrar el código de verificación solo si se ha enviado el correo y se ha seleccionado SMS */}
      {emailSent && isToggled && (
        <section className="min-h-screen flex items-center justify-center">
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <form className="mb-4" onSubmit={handleSubmit(onSubmitCode)}>
              <div className="mt-4">
                <CustomInput
                  label="Codigo de Verificacion"
                  name="codigo"
                  pattern={/^\d+$/}
                  errorMessage="Solo numeros y sin espacio"
                  errors={errors}
                  register={register}
                  trigger={trigger}
                />
                <p className="mt-2 text-sm text-gray-500">Ingrese el código de 5 dígitos enviado a su número de teléfono.</p>
              </div>
              <LoadingButton
                isLoading={isLoading}
                loadingLabel="Enviando..."
                normalLabel="Verificar Codigo"
              />
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default EmailForm;
