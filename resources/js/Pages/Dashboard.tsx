import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

interface Canal {
    id: number;
    [key: string]: any;
}

interface PageProps {
    zona?: string;
    datos?: Canal[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
            permissions: string[];
        };
    };
    [key: string]: any;
}

const toSlug = (nombre: string) =>
    nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_');

export default function Dashboard() {
    const { zona, datos = [], auth } = usePage<PageProps>().props;
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Canal>>({});

    const zonas = [
        'Combarbalá',
        'Monte Patria',
        'Ovalle',
        'Ptn',
        'Puq',
        'Salamanca',
        'Vicuña',
    ];

    const zonaMap = Object.fromEntries(zonas.map(z => [toSlug(z), z]));

    const columnas = datos.length > 0
        ? Object.keys(datos[0]).filter(key => !['created_at', 'updated_at', 'id'].includes(key))
        : [];

    const filas = datos
        .filter(fila =>
            columnas.some(col => fila[col] !== null && fila[col] !== '')
        )
        .sort((a, b) => {
            const fechaA = new Date((a.fecha || '').replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            const fechaB = new Date((b.fecha || '').replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            return fechaB.getTime() - fechaA.getTime();
        });

    const handleEditClick = (idx: number, fila: Canal) => {
        setEditIndex(idx);
        setEditData({ ...fila });
    };

    const handleChange = (col: string, value: string) => {
        setEditData(prev => ({ ...prev, [col]: value }));
    };

    const handleSave = () => {
        if (zona && editData?.id) {
            router.put(route('grilla.zona.update', [zona, editData.id]), editData, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditIndex(null);
                    setEditData({});
                },
            });
        }
    };

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="text-xl font-semibold text-gray-800">Grilla Canales</h2>}>
            <Head title="Grilla Canales" />

            <div className="flex min-h-screen">
                {/* Menú lateral */}
                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                    <nav className="space-y-2">
                        {zonas.map((z) => {
                            const slug = toSlug(z);
                            const activo = slug === zona;
                            return (
                                <a
                                    key={z}
                                    href={route('grilla.zona', slug)}
                                    className={`block px-3 py-2 rounded font-medium transition-all ${activo
                                        ? 'text-blue-700 bg-blue-100 border-l-4 border-blue-500 font-bold'
                                        : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    {z}
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                {/* Tabla */}
                <main className="flex-1 p-6 bg-gray-50">
                    <div className="mb-4 text-lg font-semibold text-gray-700">
                        {zona ? `📺 Tabla: ${zonaMap[zona] ?? zona}` : 'Selecciona una zona para ver los canales'}
                    </div>

                    {zona && filas.length > 0 ? (
                        <div className="overflow-auto border rounded bg-white p-4 shadow">
                            <table className="min-w-full border-collapse text-sm text-gray-700">
                                <thead>
                                    <tr>
                                        {columnas.map(key => (
                                            <th key={key} className="border px-4 py-2 text-left bg-gray-100">{key}</th>
                                        ))}
                                        <th className="border px-4 py-2 bg-gray-100">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filas.map((fila, idx) => (
                                        <tr key={fila.id}>
                                            {columnas.map(col => (
                                                <td key={col} className="border px-4 py-2">
                                                    {editIndex === idx ? (
                                                        <input
                                                            value={editData[col] ?? ''}
                                                            onChange={e => handleChange(col, e.target.value)}
                                                            className="w-full border rounded px-2 py-1"
                                                        />
                                                    ) : col.toLowerCase().includes('fecha') && typeof fila[col] === 'string'
                                                        ? fila[col].replace(/-/g, '/')
                                                        : fila[col]}
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
                        </div>
                    ) : zona ? (
                        <div className="text-gray-500">No hay datos disponibles para esta zona.</div>
                    ) : null}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
