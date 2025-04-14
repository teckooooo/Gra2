import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

export default function CrearUsuarios() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        axios.get('/roles').then(res => setRoles(res.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/usuarios', form);
            alert('Usuario creado correctamente');
            setForm({ name: '', email: '', password: '', role_id: '' });
        } catch (err) {
            console.error(err);
            alert('Error al crear usuario');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Head title="Crear Usuario" />
            <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <select
                        className="w-full border border-gray-300 p-2 rounded"
                        value={form.role_id}
                        onChange={e => setForm({ ...form, role_id: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Crear Usuario
                    </button>
                </form>
            </div>
        </div>
    );
}
