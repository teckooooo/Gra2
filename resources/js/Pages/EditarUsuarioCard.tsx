import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
    id: number;
    name: string;
    email: string;
    roles?: { name: string }[];
}

interface Props {
    usuario: Usuario;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditarUsuarioCard({ usuario, onClose, onUpdated }: Props) {
    const [form, setForm] = useState({
        name: usuario.name || '',
        email: usuario.email || '',
        password: '',
        role: usuario.roles?.[0]?.name || '',
    });

    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        axios.get('/roles').then(res => setRoles(res.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/usuarios/${usuario.id}`, form);
            alert('Usuario actualizado correctamente');
            onClose();
            onUpdated();
        } catch (err) {
            console.error(err);
            alert('Error al actualizar usuario');
        }
    };

    return (
        <div className="bg-white shadow-md rounded p-6 mt-4 border max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full border p-2"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Nueva Contraseña (opcional)"
                    className="w-full border p-2"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <select
                    className="w-full border p-2"
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                >
                    <option value="">Seleccionar rol</option>
                    {roles.map(r => (
                        <option key={r.id} value={r.name}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Actualizar Usuario
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 hover:underline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
