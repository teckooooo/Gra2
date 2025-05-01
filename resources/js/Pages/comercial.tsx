// ✅ Comercial.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AgregarRegistroComercialAltaModal from '@/Components/AgregarRegistroComercialAltaModal';


interface Registro {
    id: number;
    [key: string]: any;
}

interface PageProps {
    auth: any;
    tipo?: 'altas' | 'bajas';
    registros: Registro[];
}

export default function Comercial({ auth, tipo, registros }: PageProps) {
    const [opcionActiva, setOpcionActiva] = useState<'altas' | 'bajas' | null>(tipo ?? null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Registro>>({});
    const [modalOpen, setModalOpen] = useState(false);

    const columnas = registros.length > 0
        ? Object.keys(registros[0]).filter(c => !['id', 'created_at', 'updated_at'].includes(c))
        : [];

    const cambiarVista = (nuevoTipo: 'altas' | 'bajas') => {
        router.visit(route('comercial.vista', { tipo: nuevoTipo }));
    };

    const handleEditClick = (idx: number, fila: Registro) => {
        setEditIndex(idx);
        setEditData({ ...fila });
    };

    const handleChange = (col: string, value: string) => {
        setEditData(prev => ({ ...prev, [col]: value }));
    };

    const handleSave = () => {
        if (opcionActiva && editData?.id) {
            router.put(route('comercial.update', [opcionActiva, editData.id]), editData, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditIndex(null);
                    setEditData({});
                },
            });
        }
    };

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Módulo Comercial</h2>}>
            <Head title="Módulo Comercial" />

            <AgregarRegistroComercialAltaModal
                tipo={(opcionActiva ?? 'altas') as 'altas' | 'bajas'}

                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            <div className="flex min-h-screen bg-gray-100 p-4 gap-4">
                <aside className="w-64 bg-white rounded-xl shadow p-4">
                    <ul className="space-y-1">
                        {['altas', 'bajas'].map((op) => (
                            <li key={op}>
                                <button
                                    onClick={() => cambiarVista(op as 'altas' | 'bajas')}
                                    className={`w-full text-left px-4 py-2 rounded-md font-medium capitalize ${
                                        opcionActiva === op ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-800 hover:bg-gray-100'
                                    }`}
                                >
                                    {op}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="flex-1 bg-white rounded-xl shadow p-6 overflow-auto">
                    {opcionActiva ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold capitalize">Registros de {opcionActiva}</h3>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    + Agregar Registro
                                </button>
                            </div>

                            <table className="min-w-full border text-sm text-gray-700">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {columnas.map((col) => (
                                            <th key={col} className="px-4 py-2 border text-left capitalize">
                                                {col.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                        <th className="px-4 py-2 border">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.map((fila, idx) => (
                                        <tr key={fila.id}>
                                            {columnas.map(col => (
                                                <td key={col} className="border px-4 py-2">
                                                    {editIndex === idx ? (
                                                        <input
                                                            value={editData[col] ?? ''}
                                                            onChange={(e) => handleChange(col, e.target.value)}
                                                            className="w-full border rounded px-2 py-1"
                                                        />
                                                    ) : (
                                                        fila[col]
                                                    )}
                                                </td>
                                            ))}
                                            <td className="border px-4 py-2">
                                                {editIndex === idx ? (
                                                    <button onClick={handleSave} className="text-green-600 hover:underline">Guardar</button>
                                                ) : (
                                                    <button onClick={() => handleEditClick(idx, fila)} className="text-blue-600 hover:underline">Editar</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 text-lg font-medium mt-20">
                            Selecciona una opción para ver los registros
                        </div>
                    )}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
