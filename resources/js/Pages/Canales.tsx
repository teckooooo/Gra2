import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

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

    const canales = datos?.map(d => ({ id: d.id, nombre: d.canal })) ?? [];
    const decodificadores = datos?.map(d => ({ id: d.id, nombre: d.canales_con_decodificador })) ?? [];

    useEffect(() => {
        if (user && typeof user.role === 'string') {
            console.log('✅ Rol del usuario en esta vista:', user.role);
        } else {
            console.warn('⚠️ El rol del usuario no está definido');
        }
    }, [user]);

    console.log('✅ Datos recibidos:', datos);

    return (
        <Authenticated
            auth={{ user }}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Canales</h2>}
        >
            <Head title="Canales" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tabla canales */}
                    <div className="bg-gray-900 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-white mb-2">📺 Canales</h2>
                        <table className="min-w-full text-white">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Canal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {canales.map((c, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{c.nombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tabla decodificadores */}
                    <div className="bg-gray-900 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-white mb-2">🔑 Canales con Decodificador</h2>
                        <table className="min-w-full text-white">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Canal con Decodificador</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decodificadores.map((d, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{d.nombre}</td>
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
