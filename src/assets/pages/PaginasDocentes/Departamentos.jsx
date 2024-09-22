// src/components/DepartmentsCrud.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, TextInput, Label, Tooltip } from 'flowbite-react';
import { FaEdit, FaInfoCircle, FaTrash } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import  Components from '../../components/Components'
const {TitlePage, ContentTitle, Paragraphs, TitleSection, LoadingButton, SelectInput, FloatingLabelInput, ConfirmDeleteModal, InfoAlert, IconButton, DescriptionActivity, LoadingOverlay} = Components;
import { IoMdAdd } from 'react-icons/io';

const DepartmentsCrud = () => {
    const [departments, setDepartments] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState({ id: '', name: '' });
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await fetch('https://robe.host8b.me/WebServices/departamentos.php'); 
            const data = await response.json();
            if (data.done) {
                setDepartments(data.message);
            } else {
                console.error('Error fetching departments:', data.message);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleAdd = () => {
        setCurrentDepartment({ id: '', name: '' });
        setIsEditing(false);
        setModalOpen(true);
    };

    const handleEdit = (department) => {
        setCurrentDepartment(department);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
            try {
                const response = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
                const data = await response.json();
                if (data.done) {
                    fetchDepartments();
                } else {
                    console.error('Error deleting department:', data.error);
                }
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `/api/departments/${currentDepartment.id}` : '/api/departments';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentDepartment),
            });
            const data = await response.json();
            if (data.success) {
                fetchDepartments();
                setModalOpen(false);
            } else {
                console.error('Error saving department:', data.error);
            }
        } catch (error) {
            console.error('Error saving department:', error);
        }
    };

    const toggleActionsMenu = (IdDepartamento) => {
        if (isMenuOpen === IdDepartamento) {
        // Si el mismo menú está abierto, ciérralo
        setIsMenuOpen(null);
        } else {
        // Abre el menú clickeado y cierra los demás
        setIsMenuOpen(IdDepartamento);
        }
    };

    return (
        <section className='flex flex-col'>

            <ConfirmDeleteModal
                open={openModalDelete}
                onClose={() => setOpenModalDelete(false)}
                onConfirm={handleDelete}
                message="¿Estás seguro de que deseas eliminar a esta práctica?<br />También se eliminarán las calificaciones."
            />

            <h1 className="m-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Departamentos</h1>
            <div className="w-full mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 grid gap-4">
                <IconButton
                    className="ml-2"
                    Icon={IoMdAdd} // Pasa el componente de ícono
                    message="Añadir Departamentos"
                    onClick={() => handleAdd()}
                />

                <Table hoverable>
                    <Table.Head>
                    <Table.HeadCell>No</Table.HeadCell>
                    <Table.HeadCell>Nombre</Table.HeadCell>
                    <Table.HeadCell className='px-4 py-3'><div className="sr-only">Actiones</div></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {departments.map((department, index) => (
            
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>
                                    {index+1}
                                </Table.Cell>             
                                <Table.Cell>
                                    {department.vchDepartamento}
                                </Table.Cell>
                                <Table.Cell className="px-4 py-3 flex items-center justify-end">
                                    <Tooltip content="Acciones" placement="left">
                                        <button
                                            onClick={() => toggleActionsMenu(department.IdDepartamento)}
                                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                            type="button"
                                        >
                                            <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                            >
                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                    </Tooltip>

                                    {isMenuOpen === department.IdDepartamento && (
                                        <div className="mr-12 absolute z-10 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                            <ul className="py-1 text-sm" aria-labelledby="apple-imac-27-dropdown-button">
                                                <li>
                                                    <button
                                                        type="button"
                                                        data-modal-target="updateProductModal"
                                                        data-modal-toggle="updateProductModal"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                                    >
                                                        <FaEdit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        data-modal-target="readProductModal"
                                                        data-modal-toggle="readProductModal"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                                    >
                                                        <FaInfoCircle className="w-4 h-4 mr-2" />
                                                        Detalles
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        data-modal-target="deleteModal"
                                                        data-modal-toggle="deleteModal"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                                        onClick={() => setOpenModalDelete(true)}
                                                    >
                                                        <FaTrash className="w-4 h-4 mr-2" />
                                                        Eliminar
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

            </div>
            +












            +
            {/* Modal para agregar/editar */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>{isEditing ? 'Editar Departamento' : 'Agregar Departamento'}</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="name" value="Nombre del Departamento" />
                            <TextInput
                                id="name"
                                type="text"
                                value={currentDepartment.name}
                                onChange={(e) => setCurrentDepartment({ ...currentDepartment, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</Button>
                            <Button color="gray" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </section>
    );
};



export default DepartmentsCrud;
