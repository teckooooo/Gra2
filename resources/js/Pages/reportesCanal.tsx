import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SeguimientoDiario from '@/Components/SeguimientoDiario';
import JornadaAMPM from '@/Components/JornadaAMPM';
import TablaIncidencias from '@/Components/TablaIncidencias';
import TablaUltimoDia from '@/Components/TablaUltimoDia';
import SeguimientoDiarioModal from '@/Components/SeguimientoDiarioModal';
import JornadaAMPMModal from '@/Components/JornadaAMPMModal';
import TablaIncidenciasModal from '@/Components/TablaIncidenciasModal';
import TablaUltimoDiaModal from '@/Components/TablaUltimoDiaModal';
import TopCanales from '@/Components/TopCanales';

interface PageProps {
  auth: any;
  fechaInicio?: string;
  fechaFin?: string;
  datosReporte?: any;
  [key: string]: any;
}

const convertirASlug = (texto: string) => {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/ /g, '_');
};

const formatearFecha = (fecha: string): string => {
  const [yyyy, mm, dd] = fecha.split('-');
  return `${dd}/${mm}/${yyyy}`;
};

const convertirAInput = (fecha: string): string => {
  const [dd, mm, yyyy] = fecha.split('/');
  return `${yyyy}-${mm}-${dd}`;
};

const validarFechas = (inicio: string, fin: string): boolean => {
  return new Date(inicio) <= new Date(fin);
};

export default function ReportesCanal({ auth }: PageProps) {
  const { props } = usePage<PageProps>();
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [datosReporte, setDatosReporte] = useState<any>(props.datosReporte ?? null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [errorFechas, setErrorFechas] = useState<string | null>(null);

  const cableColorZonas = ['Combarbalá', 'Monte Patria', 'Ovalle','Illapel', 'Salamanca', 'Vicuña'];
  const tvRedZonas = ['Puerto Natales', 'Punta Arenas'];

  useEffect(() => {
    if (props.fechaInicio && props.fechaFin) {
      setFechaInicio(convertirAInput(props.fechaInicio));
      setFechaFin(convertirAInput(props.fechaFin));
    }
    setDatosReporte(props.datosReporte ?? null); 
  }, [props]);

  const cargarDatos = (zona: string, inicio: string, fin: string) => {
    setLoading(true);
    const zonaSlug = convertirASlug(zona);

    router.visit(`/reportes/cablecolor/${zonaSlug}?fecha_inicio=${inicio}&fecha_fin=${fin}`, {
      only: ['datosReporte', 'fechaInicio', 'fechaFin'],
      preserveState: true,
      replace: true,
      onFinish: () => setLoading(false),
    });
  };

  const handleZonaSeleccionada = (zona: string) => {
    setZonaSeleccionada(zona);
    if (fechaInicio && fechaFin && validarFechas(fechaInicio, fechaFin)) {
      setErrorFechas(null);
      cargarDatos(zona, formatearFecha(fechaInicio), formatearFecha(fechaFin));
    } else {
      setErrorFechas(null);
      cargarDatos(zona, '', '');
    }
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFechaInicio(value);
    if (zonaSeleccionada && value && fechaFin) {
      if (!validarFechas(value, fechaFin)) {
        setErrorFechas('⚠️ La fecha de inicio no puede ser mayor que la fecha de fin.');
        return;
      }
      setErrorFechas(null);
      cargarDatos(zonaSeleccionada, formatearFecha(value), formatearFecha(fechaFin));
    }
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFechaFin(value);
    if (zonaSeleccionada && fechaInicio && value) {
      if (!validarFechas(fechaInicio, value)) {
        setErrorFechas('⚠️ La fecha de inicio no puede ser mayor que la fecha de fin.');
        return;
      }
      setErrorFechas(null);
      cargarDatos(zonaSeleccionada, formatearFecha(fechaInicio), formatearFecha(value));
    }
  };

  const abrirModal = (tipo: string) => {
    setModalType(tipo);
    setModalOpen(true);
  };

  return (
    <AuthenticatedLayout auth={auth} header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Reportes Canal</h2>}>
      <Head title="Reportes Canal" />

      <div className="flex min-h-screen">
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-4">
            <div>
              <p className="font-bold mb-2">📡 CableColor</p>
              {cableColorZonas.map((zona) => (
                <button
                  key={zona}
                  onClick={() => handleZonaSeleccionada(zona)}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    zonaSeleccionada === zona ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
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
                  onClick={() => handleZonaSeleccionada(zona)}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    zonaSeleccionada === zona ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {zona}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          {!zonaSeleccionada && (
            <div className="text-gray-600">Selecciona una zona desde el menú lateral para ver los reportes.</div>
          )}

          {zonaSeleccionada && (
            <>
              <div className="flex flex-col md:flex-row items-center justify-end mb-4 gap-4">
                <div className="flex items-center">
                  <label className="mr-2 font-semibold text-gray-700">Desde:</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={handleFechaInicioChange}
                    className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex items-center">
                  <label className="mr-2 font-semibold text-gray-700">Hasta:</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={handleFechaFinChange}
                    className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              {errorFechas && (
                <div className="text-red-600 font-medium mb-4 text-sm">{errorFechas}</div>
              )}
            </>
          )}

          {loading && (
            <div className="flex items-center justify-center h-full">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          )}

          {!loading && zonaSeleccionada && datosReporte && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer" onClick={() => abrirModal('seguimiento')}>
                <SeguimientoDiario show={false} onClose={() => {}} datos={datosReporte.seguimiento} />
              </div>
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer" onClick={() => abrirModal('jornada')}>
                <JornadaAMPM show={false} onClose={() => {}} datos={datosReporte.jornada} />
              </div>
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer" onClick={() => abrirModal('topCanales')}>
                <TopCanales show={false} onClose={() => {}} datos={datosReporte.topCanales} />
              </div>
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer" onClick={() => abrirModal('tablaIncidencias')}>
                <TablaIncidencias show={false} onClose={() => {}} datos={datosReporte.incidencias} />
              </div>
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer" onClick={() => abrirModal('tablaUltimoDia')}>
                <TablaUltimoDia show={false} onClose={() => {}} datos={datosReporte.ultimoDia} />
              </div>
            </div>
          )}

          {/* Modales */}
          {modalType === 'seguimiento' && (
            <SeguimientoDiarioModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.seguimiento} />
          )}
          {modalType === 'jornada' && (
            <JornadaAMPMModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.jornada} />
          )}
          {modalType === 'topCanales' && (
            <TopCanales show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.topCanales} />
          )}
          {modalType === 'tablaIncidencias' && (
            <TablaIncidenciasModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.incidencias} />
          )}
          {modalType === 'tablaUltimoDia' && (
            <TablaUltimoDiaModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.ultimoDia} />
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
