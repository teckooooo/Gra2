import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SeguimientoDiario from '@/Components/SeguimientoDiario';
import JornadaAMPM from '@/Components/JornadaAMPM';
import TablaIncidencias from '@/Components/TablaIncidencias';
import TablaUltimoDia from '@/Components/TablaUltimoDia';
import SeguimientoDiarioModal from '@/Components/SeguimientoDiarioModal';
import JornadaAMPMModal from '@/Components/JornadaAMPMModal';
import TopCanalesModal from '@/Components/TopCanalesModal';
import TablaIncidenciasModal from '@/Components/TablaIncidenciasModal';
import TablaUltimoDiaModal from '@/Components/TablaUltimoDiaModal';
import TopCanales from '@/Components/TopCanales';
import TablaResumenCanales from '@/Components/TablaResumenCanales';
import TablaResumenIncidencias from '@/Components/TablaResumenIncidencias';

interface PageProps {
  auth: any;
  fechaInicio?: string;
  fechaFin?: string;
  datosReporte?: any;
  aniosDisponibles?: string[];
  anioActivo?: string;
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
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>('');
  const [aniosDisponibles, setAniosDisponibles] = useState<string[]>([]);

  const cableColorZonas = ['General CableColor', 'Combarbalá', 'Monte Patria', 'Ovalle', 'Illapel', 'Salamanca', 'Vicuña'];
  const tvRedZonas = ['General TVRed', 'Puerto Natales', 'Punta Arenas'];

  useEffect(() => {
    if (props.fechaInicio && props.fechaFin) {
      setFechaInicio(convertirAInput(props.fechaInicio));
      setFechaFin(convertirAInput(props.fechaFin));
    }
    setDatosReporte(props.datosReporte ?? null);
  }, [props]);

  useEffect(() => {
    if (zonaSeleccionada && esVistaGeneral()) {
      const tipo = convertirASlug(zonaSeleccionada).includes('tvred') ? 'tvred' : 'cablecolor';
      axios.get(`/reportes/anios-disponibles/${tipo}`).then((res) => {
        setAniosDisponibles(res.data);
      });
    }
  }, [zonaSeleccionada]);

// 📥 Mostrar el año recibido directamente desde Laravel (anioActivo)
useEffect(() => {
  if ('anioActivo' in props) {
    console.log(`📥 Año recibido en React desde Laravel (anioActivo): ${props.anioActivo || 'Todos'}`);
  }
}, [props.anioActivo]);

// ✅ Llama cargarDatos SOLO cuando el año cambie y haya una zona seleccionada
useEffect(() => {
  if (zonaSeleccionada && esVistaGeneral()) {
    cargarDatos(zonaSeleccionada, '', '');
  }
}, [anioSeleccionado]);


const cargarDatos = (zona: string, inicio: string, fin: string) => {
  setLoading(true);
  const zonaSlug = convertirASlug(zona);
  const isGeneral = zonaSlug === 'general_cablecolor' || zonaSlug === 'general_tvred';

  let ruta = isGeneral
    ? zonaSlug === 'general_cablecolor'
      ? '/reportes/general/cablecolor'
      : '/reportes/general/tvred'
    : `/reportes/cablecolor/${zonaSlug}`;

  const queryParams = new URLSearchParams();

  // Fechas para zonas específicas
  if (!isGeneral && inicio && fin) {
    queryParams.append('fecha_inicio', inicio);
    queryParams.append('fecha_fin', fin);
  }

  // ✅ Año para vista general solo si es válido y no es "Todos"
  const anioValido = anioSeleccionado && anioSeleccionado !== '' && anioSeleccionado !== 'Todos';

  if (isGeneral && anioValido) {
    queryParams.append('anio', anioSeleccionado);
    console.log(`📤 Enviando año a Laravel: ${anioSeleccionado}`);
  } else if (isGeneral) {
    console.log('📤 Enviando año a Laravel: Todos');
  }

  const queryString = queryParams.toString();
  if (queryString) ruta += `?${queryString}`;

  router.visit(ruta, {
    only: ['datosReporte'],
    preserveState: true,
    replace: true,
    onFinish: () => setLoading(false),
  });
};


const handleCambioDeAnio = (nuevoAnio: string) => {
  setAnioSeleccionado(nuevoAnio);
  if (zonaSeleccionada) {
    cargarDatos(zonaSeleccionada, '', '');
  }
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

  const esVistaGeneral = () => {
    const slug = convertirASlug(zonaSeleccionada || '');
    return slug === 'general_cablecolor' || slug === 'general_tvred';
  };

  const esZonaGeneral = zonaSeleccionada?.toLowerCase().includes('general');

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

          {zonaSeleccionada && esZonaGeneral && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700">Año:</label>
                <select
  value={anioSeleccionado}
  onChange={(e) => {
    const valor = e.target.value;
    setAnioSeleccionado(valor); // solo setea, no llama cargarDatos aquí
  }}
  className="border px-3 py-1 rounded"
>
  <option value="">Todos</option>
  {aniosDisponibles.map((anio) => (
    <option key={anio} value={anio}>{anio}</option>
  ))}
</select>



              </div>
            </div>
          )}

          {zonaSeleccionada && !esZonaGeneral && (
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

          {!loading && zonaSeleccionada && datosReporte && !esVistaGeneral() && (
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

          {datosReporte?.resumenCanales && datosReporte?.resumenIncidencias && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <TablaResumenCanales datos={datosReporte.resumenCanales} />
              <TablaResumenIncidencias datos={datosReporte.resumenIncidencias} />
            </div>
          )}

          {modalType === 'seguimiento' && (
            <SeguimientoDiarioModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.seguimiento} />
          )}
          {modalType === 'jornada' && (
            <JornadaAMPMModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.jornada} />
          )}
          {modalType === 'topCanales' && (
            <TopCanalesModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.topCanales} />
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
