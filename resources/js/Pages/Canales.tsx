import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

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
            permissions: string[]; // ahora obligatorio
        };
    };
    datos: Canal[];
    [key: string]: any;
}


export default function Canales() {
    const { auth, datos } = usePage<PageProps>().props;

    console.log('✅ Datos recibidos:', datos);

    const canales = datos?.map(d => ({ id: d.id, nombre: d.canal })) ?? [];
    const decodificadores = datos?.map(d => ({ id: d.id, nombre: d.canales_con_decodificador })) ?? [];

    return (
        <Authenticated auth={auth} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Canales</h2>}>
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
