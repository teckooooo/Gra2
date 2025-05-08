import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AgregarRegistroModal from '@/Components/AgregarRegistroModal';
import Select from 'react-select';

interface Canal {
    id: number;
    [key: string]: any;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PageProps {
    zona?: string;
    datos?: Pagination<Canal>; 
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
            permissions: string[];
        };
    };
    canales: string[];
    incidencias: string[];
    [key: string]: any;
}


const toSlug = (nombre: string) =>
    nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_');

export default function Dashboard() {
    const { zona, datos, auth, canales = [], incidencias = [] } = usePage<PageProps>().props;
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Canal>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [perPage, setPerPage] = useState(datos?.per_page ?? 50);

    const zonas = ['Combarbalá', 'Monte Patria', 'Ovalle', 'Illapel', 'Puerto Natales', 'Punta Arenas', 'Salamanca', 'Vicuña'];
    const zonaMap = Object.fromEntries(zonas.map(z => [toSlug(z), z]));

    const columnas = Array.isArray(datos?.data) && datos.data.length > 0
        ? Object.keys(datos.data[0]).filter(key => !['created_at', 'updated_at', 'id'].includes(key))
        : [];

    const handleEditClick = (idx: number, fila: Canal) => {
        const comuna = fila.comuna?.trim();
        const comunaValida = zonas.includes(comuna) ? comuna : zonaMap[zona ?? ''] ?? '';
    
        setEditIndex(idx);
        setEditData({ ...fila, comuna: comunaValida });
    };

    const handleChange = (col: string, value: string) => {
        setEditData(prev => ({ ...prev, [col]: value }));
    };

    const handleSave = () => {
        if (zona && editData?.id) {
            if (['punta_arenas', 'puerto_natales'].includes(zona) && !editData.formato) {
                editData.formato = 'DECO'; // valor por defecto si está vacío
            }
    
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

            <AgregarRegistroModal
                zona={zona ?? ''}
                zonas={zonas}
                canales={canales || []}
                incidencias={incidencias || []}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            <div className="flex min-h-screen">
                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                    <nav className="space-y-2">
                        {zonas.map(z => {
                            const slug = toSlug(z);
                            const activo = slug === zona;
                            return (
                                <a
                                    key={z}
                                    href={route('grilla.zona', slug)}
                                    className={`block px-3 py-2 rounded font-medium transition-all ${activo ? 'text-blue-700 bg-blue-100 border-l-4 border-blue-500 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
                                >
                                    {z}
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 p-6 bg-gray-50">
                <div className="mb-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                        {zona ? `📺 Tabla: ${zonaMap[zona] ?? zona}` : 'Selecciona una zona para ver los canales'}
                    </span>
                    {zona && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            + Agregar Registro
                        </button>
                    )}
                </div>

                    {zona && Array.isArray(datos?.data) && datos.data.length > 0 ? (

                        <div className="overflow-auto border rounded bg-white p-4 shadow">
                            <div className="mb-4 flex items-center gap-2">
                                <label className="font-medium">Registros por página:</label>
                                <select
                                    value={perPage}
                                    onChange={(e) => {
                                        const cantidad = Number(e.target.value);
                                        setPerPage(cantidad);
                                        router.visit(route('grilla.zona', zona), {
                                            data: { perPage: cantidad },
                                            preserveScroll: true,
                                        });
                                    }}
                                    className="w-20 border rounded px-2 py-1" // 👈 solución aplicada
                                >
                                    {[50, 70, 100].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>

                            <table className="min-w-full border-collapse text-sm text-gray-700">
                                <thead>
                                    <tr>
                                        {columnas.map(key => (
                                            <th key={key} className="border px-4 py-2 text-left bg-gray-100">
                                                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                                            </th>
                                        ))}
                                        <th className="border px-4 py-2 bg-gray-100">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.data.map((fila, idx) => (
                                        <tr key={fila.id}>
                                            {columnas.map(col => (
                                                <td key={col} className="border px-4 py-2">
                                                    {editIndex === idx ? (
                                                        col === 'formato' && ['punta_arenas', 'puerto_natales'].includes(zona ?? '') ? (
                                                            <select value={editData[col]} onChange={(e) => handleChange(col, e.target.value)} className="w-full border rounded px-2 py-1">
                                                                <option value="DECO">DECO</option>
                                                                <option value="Analoga">Analoga</option>
                                                            </select>
                                                        ) : col === 'canal' ? (
                                                            <Select
                                                                options={canales.map(c => ({ value: c, label: c }))}
                                                                value={{ value: editData[col] ?? '', label: editData[col] ?? '' }}
                                                                onChange={(e) => handleChange(col, e?.value || '')}
                                                            />
                                                        ) : col === 'incidencia' ? (
                                                            <Select
                                                                options={incidencias.map(i => ({ value: i, label: i }))}
                                                                value={{ value: editData[col] ?? '', label: editData[col] ?? '' }}
                                                                onChange={(e) => handleChange(col, e?.value || '')}
                                                            />
                                                        ) : col === 'jornada' ? (
                                                            <select value={editData[col]} onChange={(e) => handleChange(col, e.target.value)} className="w-full border rounded px-2 py-1">
                                                                <option value="AM">AM</option>
                                                                <option value="PM">PM</option>
                                                            </select>
                                                        ) : col === 'comuna' ? (
                                                            <select
                                                                value={editData[col] ?? zonaMap[zona ?? '']}
                                                                onChange={(e) => handleChange(col, e.target.value)}
                                                                className="w-full border rounded px-2 py-1"
                                                            >
                                                                {zonas.map(z => (
                                                                    <option key={z} value={z}>{z}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input value={editData[col] ?? ''} onChange={(e) => handleChange(col, e.target.value)} className="w-full border rounded px-2 py-1" />
                                                        )
                                                    ) : col.toLowerCase().includes('fecha') && typeof fila[col] === 'string'
                                                        ? fila[col].replace(/-/g, '/')
                                                        : fila[col]}
                                                </td>
                                            ))}
                                            <td className="border px-4 py-2 flex gap-2">
                                                {editIndex === idx ? (
                                                    <button onClick={handleSave} className="text-green-600 hover:underline">Guardar</button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEditClick(idx, fila)} className="text-blue-600 hover:underline">Editar</button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                                                                    router.delete(route('grilla.zona.destroy', [zona, fila.id]), {
                                                                        preserveScroll: true,
                                                                    });
                                                                }
                                                            }}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-center mt-4 gap-2 flex-wrap">
                                {datos.links.map((link, idx) => {
                                    let label = link.label;
                                    if (label.toLowerCase().includes('previous')) label = '←';
                                    if (label.toLowerCase().includes('next')) label = '→';
                                    return link.url ? (
                                        <button
                                            key={idx}
                                            onClick={() => router.visit(link.url!)}
                                            className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    ) : null;
                                })}
                            </div>
                        </div>
                    ) : zona ? (
                        <div className="text-gray-500">No hay datos disponibles para esta zona.</div>
                    ) : null}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
