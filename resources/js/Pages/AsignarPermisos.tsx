import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

interface Permiso {
    id: number;
    name: string;
    group: string;
}

interface Rol {
    id: number;
    name: string;
}

export default function AsignarPermisos() {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [permisos, setPermisos] = useState<Permiso[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [checkedPermissions, setCheckedPermissions] = useState<number[]>([]);
    const [showAddRole, setShowAddRole] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        axios.get('/roles').then(res => setRoles(res.data));

        axios.get('/permisos').then(res => setPermisos(res.data));

    }, []);

    useEffect(() => {
        if (selectedRole !== null) {
            axios.get(`/roles/${selectedRole}/permisos`)
                .then(res => {
                    setCheckedPermissions(res.data.map((p: Permiso) => p.id));
                })
                .catch(err => {
                    console.error("Error al obtener permisos del rol:", err);
                });
        } else {
            setCheckedPermissions([]);
        }
    }, [selectedRole]);

    const handleCheck = (permisoId: number) => {
        setCheckedPermissions(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    const handleSubmit = () => {
        if (selectedRole !== null) {
            axios.post(`/roles/${selectedRole}/permisos`, {
                permissions: checkedPermissions,
            }).then(() => {
                alert("Permisos actualizados correctamente");
            });
        }
    };

    const handleAddRole = () => {
        if (newRoleName.trim() !== '') {
            axios.post('/roles', { name: newRoleName })
                .then(res => {
                    setRoles(prev => [...prev, res.data]);
                    setSelectedRole(res.data.id);
                    setNewRoleName('');
                    setShowAddRole(false);
                });
        }
    };

    const permisosAgrupados = permisos.reduce((acc: Record<string, Permiso[]>, permiso) => {
        if (!acc[permiso.group]) acc[permiso.group] = [];
        acc[permiso.group].push(permiso);
        return acc;
    }, {});

    return (
        <div className="p-6 bg-blue-50 min-h-screen">
            <Head title="Roles" />
            <div className="flex justify-between mb-4 items-center">
                <div>
                    <label className="font-semibold text-lg">Roles</label>
                    <select
                        value={selectedRole ?? ''}
                        onChange={e => {
                            const val = e.target.value;
                            setSelectedRole(val ? Number(val) : null);
                        }}
                        className="block border p-2 w-64 mt-1"
                    >
                        <option value="">Seleccionar rol</option>
                        {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    {!showAddRole ? (
                        <button
                            onClick={() => setShowAddRole(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Añadir nuevo Rol
                        </button>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={newRoleName}
                                onChange={e => setNewRoleName(e.target.value)}
                                placeholder="Nombre del nuevo rol"
                                className="border p-2 rounded"
                            />
                            <button
                                onClick={handleAddRole}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddRole(false);
                                    setNewRoleName('');
                                }}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <h2 className="text-lg font-bold mb-2">Permisos:</h2>

            {selectedRole !== null ? (
                Object.keys(permisosAgrupados).map(grupo => (
                    <div key={grupo} className="mb-6 bg-white border p-4 rounded shadow">
                        <h3 className="font-bold text-sm mb-2">Sección de {grupo}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {permisosAgrupados[grupo].map(permiso => (
                                <label
                                    key={permiso.id}
                                    className="bg-green-200 px-2 py-1 rounded flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={checkedPermissions.includes(permiso.id)}
                                        onChange={() => handleCheck(permiso.id)}
                                    />
                                    {permiso.name}
                                </label>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 italic">Selecciona un rol para ver los permisos disponibles.</p>
            )}

            {selectedRole !== null && (
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Guardar cambios
                </button>
            )}
        </div>
    );
}
