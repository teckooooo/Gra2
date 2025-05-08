import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AgregarRegistroComercialAltaModal from '@/Components/AgregarRegistroComercialAltaModal';

interface Registro {
    id: number;
    [key: string]: any;
}

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginacion<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Link[];
}

interface PageProps {
    auth: any;
    tipo?: 'altas' | 'bajas';
    registros?: Paginacion<Registro>;
    ejecutivos?: string[];
    tiposOT?: string[];
    sucursales?: string[];
    planes?: string[];
}

export default function Comercial({ auth, tipo, registros, ejecutivos = [], tiposOT = [], sucursales = [], planes = [] }: PageProps) {
    const [opcionActiva, setOpcionActiva] = useState<'altas' | 'bajas' | null>(tipo ?? null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Registro>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [perPage, setPerPage] = useState<number>(registros?.per_page ?? 50);

    const columnas = Array.isArray(registros?.data) && registros.data.length > 0
        ? Object.keys(registros.data[0]).filter(c => !['id', 'created_at', 'updated_at'].includes(c))
        : [];

    const cambiarVista = (nuevoTipo: 'altas' | 'bajas') => {
        router.visit(route('comercial.vista', { tipo: nuevoTipo, perPage }));
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
                    router.reload();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (opcionActiva && confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            router.delete(route('comercial.delete', [opcionActiva, id]), {
                preserveScroll: true,
                onSuccess: () => router.reload(),
            });
        }
    };

    const cambiarCantidad = (cantidad: number) => {
        setPerPage(cantidad);
        router.visit(route('comercial.vista', { tipo: opcionActiva, perPage: cantidad }));
    };

    const obtenerOpciones = (col: string): string[] => {
        switch (col) {
            case 'ejecutivo': return ejecutivos;
            case 'tipo_ot': return tiposOT;
            case 'sucursal':
            case 'comuna': return sucursales;
            case 'plan': return planes;
            default: return [];
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
                    {opcionActiva && registros?.data ? (
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

                            <div className="mb-4 flex items-center gap-2">
                                <label className="font-medium">Registros por página:</label>
                                <select
                                    value={perPage}
                                    onChange={(e) => cambiarCantidad(Number(e.target.value))}
                                    className="w-20 border rounded px-2 py-1"
                                >
                                    {[50, 70, 100].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
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
                                    {registros.data.map((fila, idx) => (
                                        <tr key={fila.id}>
                                            {columnas.map(col => (
                                                <td key={col} className="border px-4 py-2">
                                                    {editIndex === idx ? (
                                                        obtenerOpciones(col).length > 0 ? (
                                                            <select
                                                                value={editData[col] ?? ''}
                                                                onChange={(e) => handleChange(col, e.target.value)}
                                                                className="w-full border rounded px-2 py-1"
                                                            >
                                                                <option value="">Seleccione {col}</option>
                                                                {obtenerOpciones(col).map(op => (
                                                                    <option key={op} value={op}>{op}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                value={editData[col] ?? ''}
                                                                onChange={(e) => handleChange(col, e.target.value)}
                                                                className="w-full border rounded px-2 py-1"
                                                            />
                                                        )
                                                    ) : (
                                                        fila[col]
                                                    )}
                                                </td>
                                            ))}
                                            <td className="border px-4 py-2 space-x-2">
                                                {editIndex === idx ? (
                                                    <button onClick={handleSave} className="text-green-600 hover:underline">Guardar</button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEditClick(idx, fila)} className="text-blue-600 hover:underline">Editar</button>
                                                        <button onClick={() => handleDelete(fila.id)} className="text-red-600 hover:underline">Eliminar</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-center mt-4 gap-2 flex-wrap">
                                {registros.links.map((link, index) => {
                                    let label = link.label;
                                    if (label.toLowerCase().includes('previous')) label = '←';
                                    if (label.toLowerCase().includes('next')) label = '→';

                                    return link.url ? (
                                        <button
                                            key={index}
                                            onClick={() => router.visit(link.url!)}
                                            className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    ) : null;
                                })}
                            </div>
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
