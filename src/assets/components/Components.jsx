import React, { useState, useEffect  } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Label, TextInput, Button, Select, Modal, Tooltip } from "flowbite-react"; // Importamos el componente Button
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; // Importa íconos de react-icons
import { AiOutlineClose } from 'react-icons/ai';

const TitlePage = ({ label }) => 
{   
    return (
        <h1 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">{label}</h1>
    )
}

const TitleSection = ({ label }) => 
{   
    return (
        <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">{label}</h3>
    )
}

const ContentTitle = ({ label }) => 
{   
    return (
        <h5 className="mb-D2 text-sm font-medium text-gray-900 dark:text-white">{label}</h5>
    )
}

const Paragraphs = ({className, label }) => 
{   
    return (
        <p className={`${className} mb-3 text-gray-500 dark:text-gray-400`}>
        {label}
        </p>
    )
}

const Link = ({ to, children }) => {
    return (
        <RouterLink 
            to={to}
            className="text-primary hover:text-secondary transition-colors duration-300"
        >
            {children}
        </RouterLink>
    );
};


const IconButton = ({ message, className = '', Icon, ...rest }) => {
    return (
        <Tooltip content={message} className="block md:hidden">
            <Button
                theme={{
                    color: {
                        primary: "bg-primary hover:bg-secondary",
                        gray: "bg-purple-500 hover:bg-gray-800",
                    },
                }}
                type="submit"
                color="primary"
                className={`
                    bg-primary hover:bg-secondary text-white 
                    rounded-full md:rounded-md  // Redondeado en móviles, bordes normales en pantallas grandes
                    p-2 md:px-2 md:py-2         // Ajusta el padding para pantallas pequeñas y grandes
                    text-sm md:text-base        // Tamaño de texto ajustado para pantallas pequeñas
                    w-12 h-12 md:w-auto md:h-auto // Botón cuadrado en móviles y de tamaño automático en pantallas grandes
                    flex items-center justify-center // Centrar contenido
                    ${className} 
                `}
                {...rest}
                variant="outlined"
            >
                {Icon && <Icon className="text-lg" />} {/* Tamaño del icono */}
                <span className="hidden md:inline"> {/* Texto oculto en móviles y visible en pantallas medianas y grandes */}
                    {message}
                </span>
            </Button>
        </Tooltip>
    );
};


const LoadingButton = ({ isLoading, normalLabel, loadingLabel, className, ...rest }) => {
    return (
        <Button
        theme={{

            color: {
                gray: "bg-purple-500 hover:bg-gray-800",
            },
          }}
            type="submit"
            color="primary" // Esto aplica el color base
            className={`bg-primary hover:bg-secondary w-full p-3 text-white rounded-md  ${className}`} // Agregar la clase className aquí
            disabled={isLoading}
            {...rest}
            >
            {
                isLoading ? 
                (
                    <>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    {loadingLabel}
                    </>
                ) 
                : 
                (
                    normalLabel
                )
            }
        </Button>
    );
};

const FloatingLabelInput = ({id, label, value, onChange, placeholder = '', className = '', ...props}) => 
{
    return (
        <div className={`relative ${className}`}>
            <input
            type="text"
            id={id}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...props}
            />
            <label
            htmlFor={id}
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
            {label}
            </label>
        </div>
    );
};

const CustomInput = ({ label, value, name, errors, register, trigger, errorMessage, pattern }) => 
{
    const [inputError, setInputError] = useState(false);

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                type='text'
                id={name}
                value={value}
                aria-describedby={`${name}_help`}
                className=
                {`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer 
                    ${
                        errors[name]
                        ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                        : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                    } peer`
                }
                placeholder=" "
                {...register(name, { required: true, pattern: pattern})}
                onBlur={() => trigger(name).then((isValid) => setInputError(!isValid))}
                onKeyUp={() => setInputError(false)}
                />
                <label
                htmlFor={name}
                className={`absolute text-sm 
                ${
                    errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                } 
                duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
                ${
                    errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                } 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                {label}
                </label>
            </div>
            {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    <span className="font-medium">Oh, snapp!</span>{' '}
                    {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
        </div>
    );
};
/*
const CustomInput = ({ label, value, name, errors, register, trigger, errorMessage, pattern, onChange }) => {
    const [inputError, setInputError] = useState(false);

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                    type='text'
                    id={name}
                    value={value}
                    aria-describedby={`${name}_help`}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer 
                        ${
                            errors[name]
                            ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                            : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                        } peer`}
                    placeholder=" "
                    {...register(name, { required: true, pattern: pattern })}
                    onBlur={() => trigger(name).then((isValid) => setInputError(!isValid))}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    onKeyUp={() => setInputError(false)}
                />
                <label
                    htmlFor={name}
                    className={`absolute text-sm 
                    ${
                        errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                    } 
                    duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
                    ${
                        errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                    } 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                    {label}
                </label>
            </div>
            {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span className="font-medium">Oh, snapp!</span>{' '}
                        {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
        </div>
    );
};*/

const CustomInputOnchange = ({ label, value, type, name, onChange, errors, register, trigger, errorMessage, pattern }) => {
    const [inputError, setInputError] = useState(false);

    const handleBlur = async () => {
        // Valida el campo cuando el usuario sale del campo
        const isValid = await trigger(name);
        setInputError(!isValid);
    };

    const handleChange = (e) => {
        onChange(e.target.value);
        // Puedes agregar aquí una validación rápida si es necesario

    };

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                    type={type}
                    id={name}
                    value={value}
                    aria-describedby={`${name}_help`}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer 
                        ${errors[name]
                        ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                        : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'} peer`}
                    placeholder=" "
                    {...register(name, { required: true, pattern })}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyUp={() => setInputError(false)}
                />
                <label
                    htmlFor={name}
                    className={`absolute text-sm 
                        ${errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} 
                        duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
                        ${errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'} 
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                    {label}
                </label>
            </div>
            {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span className="font-medium">Oh, snapp!</span>{' '}
                        {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
        </div>
    );
};

const CustomInputPassword = ({ label, name, errors, register, trigger, pattern, errorMessage, onBlur, onKeyUp, type }) => 
{
    const [inputError, setInputError] = useState(false);

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                type={type || 'text'}
                id={name}
                aria-describedby={`${name}_help`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    errors[name]
                    ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                    : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                } peer`}
                placeholder=" "
                {...register(name, { required: true, pattern })}
                onBlur={(e) => trigger(name).then((isValid) => {setInputError(!isValid); onBlur && onBlur(e);})}
                onKeyUp={(e) =>trigger(name).then((isValid) => {setInputError(!isValid); onBlur && onBlur(e);})}
                />
                <label
                htmlFor={name}
                className={`absolute text-sm ${
                    errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 ${
                    errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                {label}
                </label>
            </div>
            {inputError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                <span className="font-medium">Oh, snapp!</span>{' '}
                {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                </p>
            )}
        </div>
    );
};

const CustomRepeatPassword = ({ label, name, errors, register, trigger, watch, type }) => 
{

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                type={type || 'text'}
                id={name}
                aria-describedby={`${name}_help`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    errors[name]
                    ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                    : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                } peer`}
                placeholder=" "
                {...register(name, {
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                })}                
                onBlur={() => trigger(name)}
                onKeyUp={() => trigger(name)}
                />
                <label
                htmlFor={name}
                className={`absolute text-sm ${
                    errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 ${
                    errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                {label}
                </label>
            </div>
            {errors.passwordRepeat && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            <span className="font-medium">Oh, snapp!</span> {errors.passwordRepeat.message}
                        </p>
                        )}
        </div>
    );
};


const SelectInput =  ({ id, label, labelSelect, name, option, options, errors, register, trigger, errorMessage, pattern, ...rest })=>
{
    const [inputError, setInputError] = useState(false);

    return(

    <div className="max-w-md">
        <div className="mb-2 block">
            <Label htmlFor={id} value={label} />
        </div>
        <Select id={id} required 
            {...register(name, { required: true, pattern: pattern})}
            onBlur={() => trigger(name).then((isValid) => setInputError(!isValid))}
            {...rest}
        >
        <option defaultChecked value="0">{labelSelect} </option>
        {options && options.map((option) => (
            <option key={option[id]} value={option[id]}>
                {option[name]} 
            </option>
        ))}
        </Select>
        {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    <span className="font-medium">Oh, snapp!</span>{' '}
                    {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
    </div>
    );
};

const ConfirmDeleteModal = ({ open, onClose, onConfirm, message }) => {
    return (
        <Modal className='h-0 mt-auto' show={open} size="md" onClose={onClose} popup>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                <span dangerouslySetInnerHTML={{ __html: message }} />
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={onConfirm}>
                                    Sí, estoy seguro
                                </Button>
                                <Button color="gray" onClick={onClose}>
                                    No, cancelar
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            </div>
        </Modal>
    );
};

const InfoAlert = ({ message, type, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 1900);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    // Estilos y colores según el tipo de alerta
    let bgColor, textColor, progressColor, Icon;
    switch (type) {
        case "success":
            bgColor = "bg-green-50 dark:bg-gray-800";
            textColor = "text-green-800 dark:text-green-400";
            progressColor = "bg-green-500";
            Icon = FaCheckCircle;
            break;
        case "error":
            bgColor = "bg-red-50 dark:bg-gray-800";
            textColor = "text-red-800 dark:text-red-400";
            progressColor = "bg-red-500";
            Icon = FaExclamationCircle;
            break;
        case "info":
        default:
            bgColor = "bg-blue-50 dark:bg-gray-800";
            textColor = "text-blue-800 dark:text-blue-400";
            progressColor = "bg-blue-500";
            Icon = FaInfoCircle;
            break;
    }

    return (
        <div
            id="alert-1"
            className={`alert-slide flex items-center p-4 mb-4 rounded-lg shadow-lg ${bgColor} ${textColor}`}
            role="alert"
        >
            <Icon className="flex-shrink-0 w-4 h-4" aria-hidden="true" />
            <div className="ms-3 text-sm font-medium">{message}</div>
            <button
                type="button"
                className={`ms-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} rounded-lg focus:ring-2 p-1.5 hover:bg-opacity-75 inline-flex items-center justify-center h-8 w-8`}
                onClick={onClose}
                aria-label="Close"
            >
                <AiOutlineClose className="w-3 h-3" />
            </button>
            {/* Barra de progreso con animación */}
            <div
                className={`progress-bar absolute bottom-0 left-0 h-1 ${progressColor}`}
            ></div>
        </div>
    );
};

export default {
    TitlePage,  
    TitleSection, 
    ContentTitle, 
    Paragraphs, 
    Link,
    IconButton,
    LoadingButton, 
    FloatingLabelInput,
    CustomInput, 
    CustomInputPassword, 
    CustomRepeatPassword,
    CustomInputOnchange,
    SelectInput,
    ConfirmDeleteModal,
    InfoAlert
};