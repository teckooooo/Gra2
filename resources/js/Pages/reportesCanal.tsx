import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SeguimientoDiario from '@/Components/SeguimientoDiario';
import JornadaAMPM from '@/Components/JornadaAMPM';
import TablaIncidencias from '@/Components/TablaIncidencias';
import TablaUltimoDia from '@/Components/TablaUltimoDia';
import SeguimientoDiarioModal from '@/Components/SeguimientoDiarioModal';
import JornadaAMPMModal from '@/Components/JornadaAMPMModal';
import TablaIncidenciasModal from '@/Components/TablaIncidenciasModal';
import TablaUltimoDiaModal from '@/Components/TablaUltimoDiaModal';

interface PageProps {
  auth: any;
}

const convertirASlug = (texto: string) => {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/ /g, '_');
};

export default function ReportesCanal({ auth }: PageProps) {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [datosReporte, setDatosReporte] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const cableColorZonas = ['Combarbalá', 'Monte Patria', 'Ovalle', 'Salamanca', 'Vicuña'];
  const tvRedZonas = ['Puerto Natales', 'Punta Arenas'];

  const handleZonaSeleccionada = (zona: string) => {
    setZonaSeleccionada(zona);
    setLoading(true);
    const zonaSlug = convertirASlug(zona);

    router.visit(`/reportes/cablecolor/${zonaSlug}`, {
      only: ['datosReporte'],
      preserveState: true,
      onSuccess: (page) => {
        setDatosReporte((page.props as any).datosReporte);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const abrirModal = (tipo: string) => {
    setModalType(tipo);
    setModalOpen(true);
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
              {cableColorZonas.map((zona) => (
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
              {tvRedZonas.map((zona) => (
                <button
                  key={zona}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-400"
                  disabled
                >
                  {zona} (Próximamente)
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6 bg-gray-50">
          {!zonaSeleccionada && (
            <div className="text-gray-600">
              Selecciona una zona desde el menú lateral para ver los reportes.
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-full">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          )}

          {!loading && zonaSeleccionada && datosReporte && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Seguimiento Diario */}
              <div
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => abrirModal('seguimiento')}
              >
                <SeguimientoDiario show={false} onClose={() => {}} datos={datosReporte.seguimiento} />
              </div>

              {/* Jornada AM/PM */}
              <div
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => abrirModal('jornada')}
              >
                <JornadaAMPM show={false} onClose={() => {}} datos={datosReporte.jornada} />
              </div>

              {/* Tabla Incidencias */}
              <div
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => abrirModal('tablaIncidencias')}
              >
                <TablaIncidencias show={false} onClose={() => {}} datos={datosReporte.incidencias} />
              </div>

              {/* Tabla Último Día */}
              <div
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => abrirModal('tablaUltimoDia')}
              >
                <TablaUltimoDia show={false} onClose={() => {}} datos={datosReporte.ultimoDia} />
              </div>
            </div>
          )}

          {/* MODALES ACTIVOS */}
          {modalType === 'seguimiento' && (
            <SeguimientoDiarioModal
              show={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setModalType(null);
              }}
              datos={datosReporte.seguimiento}
            />
          )}

          {modalType === 'jornada' && (
            <JornadaAMPMModal
              show={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setModalType(null);
              }}
              datos={datosReporte.jornada}
            />
          )}

          {modalType === 'tablaIncidencias' && (
            <TablaIncidenciasModal
              show={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setModalType(null);
              }}
              datos={datosReporte.incidencias}
            />
          )}

          {modalType === 'tablaUltimoDia' && (
            <TablaUltimoDiaModal
              show={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setModalType(null);
              }}
              datos={datosReporte.ultimoDia}
            />
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
