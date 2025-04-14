import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

export default function CrearUsuarios() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        axios.get('/api/roles').then(res => setRoles(res.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/usuarios', form);
            alert('Usuario creado correctamente');
            setForm({ name: '', email: '', password: '', role: '' });
        } catch (err) {
            console.error(err);
            alert('Error al crear usuario');
        }
    };

    return (
        <div className="p-6">
            <Head title="Crear Usuario" />
            <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
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
                    placeholder="Contraseña"
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
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Crear Usuario
                </button>
            </form>
        </div>
    );
}
