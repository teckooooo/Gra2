import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrearUsuarioCard from './CrearUsuarioCard';
import EditarUsuarioCard from './EditarUsuarioCard';
import { Head } from '@inertiajs/react';

interface Usuario {
    id: number;
    name: string;
    email: string;
    roles?: { name: string }[];
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [mostrarCrear, setMostrarCrear] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    const cargarUsuarios = async () => {
        try {
            const res = await axios.get('/usuarios');
            if (Array.isArray(res.data)) {
                setUsuarios(res.data);
            } else {
                console.error('La respuesta no es un array:', res.data);
                setUsuarios([]);
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    const eliminarUsuario = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`/usuarios/${id}`);
                cargarUsuarios();
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            }
        }
    };

    const abrirFormularioNuevo = () => {
        setUsuarioSeleccionado(null);
        setMostrarCrear(true);
    };

    const abrirFormularioEdicion = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setMostrarEditar(true);
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <div className="p-6 relative z-10">
            <Head title="Gestor de Usuarios" />
            <h1 className="text-2xl font-bold mb-4">Gestor de Usuarios</h1>

            <button
                onClick={abrirFormularioNuevo}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Añadir Usuario
            </button>

            {/* Modal Crear Usuario */}
            {mostrarCrear && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <CrearUsuarioCard
                        onClose={() => setMostrarCrear(false)}
                        onCreated={cargarUsuarios}
                    />
                </div>
            )}

            {/* Modal Editar Usuario */}
            {mostrarEditar && usuarioSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <EditarUsuarioCard
                        usuario={usuarioSeleccionado}
                        onClose={() => {
                            setMostrarEditar(false);
                            setUsuarioSeleccionado(null);
                        }}
                        onUpdated={cargarUsuarios}
                    />
                </div>
            )}

            <table className="w-full mt-6 border">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Rol</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td className="p-2 border">{user.name}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{user.roles?.[0]?.name || 'Sin rol'}</td>
                            <td className="p-2 border space-x-2">
                                <button
                                    onClick={() => abrirFormularioEdicion(user)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => eliminarUsuario(user.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
