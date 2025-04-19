import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Canal {
    id: number;
    canal: string;
    canales_con_decodificador: string;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string; // opcional
            permissions: string[];
        };
    };
    datos: Canal[];
    [key: string]: any;
}

export default function Canales() {
    const { auth, datos } = usePage<PageProps>().props;
    const user = auth?.user;
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        nombre: '',
        tipo: 'normal',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('canales.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este canal?')) {
            router.delete(route('canales.destroy', id));
        }
    };

    const handleEdit = (canal: Canal) => {
        // Aquí puedes abrir el modal con los datos cargados para editar
        setData({
            nombre: canal.canal || canal.canales_con_decodificador,
            tipo: canal.canal ? 'normal' : 'decodificador',
        });
        setShowModal(true);
    };

    const canales = datos.filter(d => d.canal).map((d, i) => ({ ...d, index: i + 1 }));
    const decodificadores = datos.filter(d => d.canales_con_decodificador).map((d, i) => ({ ...d, index: i + 1 }));

    return (
        <Authenticated
            auth={{ user }}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Canales</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        + Agregar Canal
                    </button>
                </div>
            }
        >
            <Head title="Canales" />

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded shadow p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Agregar Canal</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Nombre del Canal</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Tipo</label>
                                <select
                                    value={data.tipo}
                                    onChange={e => setData('tipo', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="normal">Canal</option>
                                    <option value="decodificador">Con Decodificador</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLAS */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tabla canales */}
                    <div className="bg-gray-900 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-white mb-2">📺 Canales</h2>
                        <table className="min-w-full text-white">
                            <thead>
                                <tr><th>#</th><th>Nombre</th><th>Acciones</th></tr>
                            </thead>
                            <tbody>
                                {canales.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.index}</td>
                                        <td>{c.canal}</td>
                                        <td className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(c)}
                                                className="text-yellow-400 hover:underline"
                                            >Editar</button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="text-red-500 hover:underline"
                                            >Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tabla con decodificador */}
                    <div className="bg-gray-900 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-white mb-2">🔑 Canales con Decodificador</h2>
                        <table className="min-w-full text-white">
                            <thead>
                                <tr><th>#</th><th>Nombre</th><th>Acciones</th></tr>
                            </thead>
                            <tbody>
                                {decodificadores.map((d) => (
                                    <tr key={d.id}>
                                        <td>{d.index}</td>
                                        <td>{d.canales_con_decodificador}</td>
                                        <td className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(d)}
                                                className="text-yellow-400 hover:underline"
                                            >Editar</button>
                                            <button
                                                onClick={() => handleDelete(d.id)}
                                                className="text-red-500 hover:underline"
                                            >Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
