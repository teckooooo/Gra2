import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SeguimientoDiario from '@/Components/SeguimientoDiario';
import TopCanales from '@/Components/TopCanales';
import JornadaAMPM from '@/Components/JornadaAMPM';
import TablaIncidencias from '@/Components/TablaIncidencias';
import TablaUltimoDia from '@/Components/TablaUltimoDia';

interface PageProps {
    auth: any;
    datosReporte?: any; // <- importante para que cuando cargue la vista inicial no explote
}

const convertirASlug = (texto: string) => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_');
};

export default function ReportesCanal({ auth }: PageProps) {
    const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
    const [datosReporte, setDatosReporte] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const cableColorZonas = ['Combarbalá', 'Monte Patria', 'Ovalle', 'Salamanca', 'Vicuña'];
    const tvRedZonas = ['Puerto Natales', 'Punta Arenas'];

    const handleZonaSeleccionada = (zona: string) => {
        setZonaSeleccionada(zona);
        setLoading(true);

        const zonaSlug = convertirASlug(zona);

        router.get(route('reporte.cablecolor', { zona: zonaSlug }), {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['datosReporte'],
            onSuccess: (page) => {
                setDatosReporte((page.props as any).datosReporte);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Reportes Canal</h2>}>
            <Head title="Reportes Canal" />

            <div className="flex min-h-screen">
                {/* Menú lateral */}
                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                    <nav className="space-y-4">
                        <div>
                            <p className="font-bold mb-2">📡 CableColor</p>
                            {cableColorZonas.map(zona => (
                                <button
                                    key={zona}
                                    onClick={() => handleZonaSeleccionada(zona)}
                                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                                >
                                    {zona}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6">
                            <p className="font-bold mb-2">📺 TV Red</p>
                            {tvRedZonas.map(zona => (
                                <button
                                    key={zona}
                                    disabled
                                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-400"
                                >
                                    {zona} (Próximamente)
                                </button>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Contenido */}
                <main className="flex-1 p-6 bg-gray-50">
                    {!zonaSeleccionada && (
                        <div className="text-gray-600">
                            Selecciona una zona desde el menú lateral para ver los reportes.
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        </div>
                    )}

                    {!loading && zonaSeleccionada && datosReporte && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-4">Informe {zonaSeleccionada}</h2>

                            <SeguimientoDiario datos={datosReporte.seguimiento} />
                            <TopCanales datos={datosReporte.topCanales} />
                            <JornadaAMPM datos={datosReporte.jornada} />
                            <TablaIncidencias datos={datosReporte.incidencias} />
                            <TablaUltimoDia datos={datosReporte.ultimoDia} />
                        </div>
                    )}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
