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
import GraficoPorcentajeIncidencias from '@/Components/GraficoPorcentajeIncidencias';
import GraficoPorcentajeIncidenciasModal from '@/Components/GraficoPorcentajeIncidenciasModal';
import TablaResumenCanalesModal from '@/Components/TablaResumenCanalesModal';
import TablaResumenIncidenciasModal from '@/Components/TablaResumenIncidenciasModal';

interface ZonaData {
  seguimiento?: any;
  jornada?: any;
  topCanales?: any;
  incidencias?: any;
  ultimoDia?: any;
  resumenCanales?: any;
  resumenIncidencias?: any;
  porcentajeIncidencias?: any;
}


interface PageProps {
  auth: any;
  fechaInicio?: string;
  fechaFin?: string;
  datosReporte?: Record<string, ZonaData>;
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

  const [porcentajeIncidencias, setPorcentajeIncidencias] = useState(null);
  const [loadingGrafico, setLoadingGrafico] = useState(false);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);


const cerrarModal = () => setModalAbierto(null);



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


useEffect(() => {
  const esGeneral = zonaSeleccionada && esVistaGeneral();
  const anioValido = anioSeleccionado && anioSeleccionado !== 'Todos';

  if (esGeneral) {
    const tipo = convertirASlug(zonaSeleccionada).includes('tvred') ? 'tvred' : 'cablecolor';

    setLoadingGrafico(true);
    axios
      .get(`/reportes/porcentaje-incidencias/${tipo}?anio=${anioValido ? anioSeleccionado : ''}`)
      .then((res) => {
        setPorcentajeIncidencias(res.data);
        setLoadingGrafico(false);
      });
  } else {
    // Limpia los datos si se cambia a una zona específica
    setPorcentajeIncidencias(null);
  }
}, [zonaSeleccionada, anioSeleccionado]);



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
  console.log('📊 porcentajeIncidencias:', datosReporte?.porcentajeIncidencias);
  const resumen = document.getElementById('GraficoPorcentajeIncidencias') as HTMLCanvasElement;



  const exportarInformePDF = async () => {
    const zonas = Object.keys(datosReporte.zonas || {});
    const imagenes = [];
    const tablas: Record<string, any> = {};
  
    // 📊 Gráfico general
    const resumen = document.getElementById('GraficoPorcentajeIncidencias') as HTMLCanvasElement | null;
    if (resumen) {
      imagenes.push({
        titulo: 'Resumen General',
        base64: resumen.toDataURL('image/png'),
      });
    }
  
    const resumenCanales = document.querySelectorAll('#TablaResumenCanales tbody tr');
    const resumenIncidencias = document.querySelectorAll('#TablaResumenIncidencias tbody tr');
    
    tablas['general'] = {
      resumenCanales: resumenCanales.length > 0
        ? Array.from(resumenCanales).map(row => {
            const cells = row.querySelectorAll('td');
            return {
              canal: cells[0]?.innerText || '',
              cantidad: parseInt(cells[1]?.innerText || '0'),
              porcentaje: cells[2]?.innerText?.replace('%', '') || '0',
            };
          })
        : [],
      resumenIncidencias: resumenIncidencias.length > 0
        ? Array.from(resumenIncidencias).map(row => {
            const cells = row.querySelectorAll('td');
            return {
              incidencia: cells[0]?.innerText || '',
              cantidad: parseInt(cells[1]?.innerText || '0'),
              porcentaje: cells[2]?.innerText?.replace('%', '') || '0',
            };
          })
        : [],
    };
    

  
    // 📊 Gráficos y tablas por zona
    zonas.forEach((zona) => {
      const slug = convertirASlug(zona);
      tablas[zona] = {};
  
      ['SeguimientoDiario', 'JornadaAMPM', 'TopCanales'].forEach((grafico) => {
        const wrapper = document.getElementById(`${grafico}-${slug}`);
        const canvas = wrapper?.querySelector('canvas') as HTMLCanvasElement | null;
  
        if (canvas) {
          imagenes.push({
            titulo: `${grafico} - ${zona}`,
            base64: canvas.toDataURL('image/png'),
          });
        }
      });
  
      // Tabla: Incidencias
      const tablaIncidencias = document.querySelectorAll(`#TablaIncidencias-${slug} tbody tr`);
      if (tablaIncidencias.length > 0) {
        tablas[zona].resumenIncidencias = Array.from(tablaIncidencias).map(row => {
          const cells = row.querySelectorAll('td');
          return {
            incidencia: cells[0]?.innerText || '',
            cantidad: parseInt(cells[1]?.innerText || '0'),
            porcentaje: cells[2]?.innerText?.replace('%', '') || '0',
          };
        });
      }
  
      // Tabla: Último día
      const tablaUltimoDia = document.querySelectorAll(`#TablaUltimoDia-${slug} tbody tr`);
      if (tablaUltimoDia.length > 0) {
        tablas[zona].ultimoDia = Array.from(tablaUltimoDia).map(row => {
          const cells = row.querySelectorAll('td');
          return {
            canal: cells[0]?.innerText || '',
            fecha: cells[1]?.innerText || '',
            incidencia: cells[2]?.innerText || '',
          };
        });
      }
    });
  
    if (imagenes.length === 0 && Object.keys(tablas).length === 0) {
      alert('⚠️ No se capturaron datos para exportar.');
      return;
    }
  
    try {
      const response = await axios.post('/reportesCanal/pdf/exportar', {
        imagenes,
        tablas,
      }, {
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte_general.pdf';
      link.click();
    } catch (error) {
      console.error('❌ Error exportando PDF:', error);
      alert('Ocurrió un error al exportar el PDF.');
    }
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

          {zonaSeleccionada && esZonaGeneral && (
            <div className="flex justify-end mb-4 gap-4">
              
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700">Año:</label>
              <select
                value={anioSeleccionado}
                onChange={(e) => {
                  const valor = e.target.value;
                  setAnioSeleccionado(valor); 
                }}
                className="w-24 border px-3 py-1 rounded"
              >
                <option value="">Todos</option>
                {aniosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
          
            <button
              onClick={exportarInformePDF}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              📄 Exportar PDF
            </button>
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

{esVistaGeneral() && datosReporte?.zonas && (
  <>
    {/* 🔷 Resumen General */}
    <div className="mb-10 border-b pb-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumen General</h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div id="TablaResumenCanales">
          <TablaResumenCanales datos={datosReporte.resumenCanales} />
        </div>
        <div id="TablaResumenIncidencias">
          <TablaResumenIncidencias datos={datosReporte.resumenIncidencias} />
        </div>
      </div>

      {datosReporte.porcentajeIncidencias && (
        <div className="mt-10">
          <GraficoPorcentajeIncidencias
            show={true}
            onClose={() => {}}
            datos={datosReporte.porcentajeIncidencias}
          />
        </div>
        
      )}
    </div>

    {/* 🔒 Render oculto para exportar todos los gráficos/tablas por zona */}
      {Object.entries(datosReporte.zonas).map(([nombreZona, zonaData]: [string, any]) => {
        const slug = convertirASlug(nombreZona);
        return (
          <div key={slug}>
            {zonaData.seguimiento && (
              <SeguimientoDiario
                show={false}
                onClose={() => {}}
                datos={zonaData.seguimiento}
                zonaId={slug}
                id={`SeguimientoDiario-${slug}`}
              />
            )}
            {zonaData.jornada && (
              <JornadaAMPM
                show={false}
                onClose={() => {}}
                datos={zonaData.jornada}
                zonaId={slug}
                id={`JornadaAMPM-${slug}`}
              />
            )}
            {zonaData.topCanales && (
              <TopCanales
                show={false}
                onClose={() => {}}
                datos={zonaData.topCanales}
                zonaId={slug}
                id={`TopCanales-${slug}`}
              />
            )}
            {zonaData.incidencias && (
              <TablaIncidencias
                show={false}
                onClose={() => {}}
                datos={zonaData.incidencias}
                zonaId={slug}
                id={`TablaIncidencias-${slug}`}
              />
            )}
            {zonaData.ultimoDia && (
              <TablaUltimoDia
                show={false}
                onClose={() => {}}
                datos={zonaData.ultimoDia}
                zonaId={slug}
                id={`TablaUltimoDia-${slug}`}
              />
            )}
          </div>
        );
      })}
  </>
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
          {modalType === 'porcentajeIncidencias' && (
            <GraficoPorcentajeIncidenciasModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.porcentajeIncidencias} />
          )}
          {modalType === 'TablaResumenCanalesModal' && (
            <TablaResumenCanalesModal show={modalOpen} onClose={() => setModalOpen(false)} datos={datosReporte.resumenCanales} />
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}