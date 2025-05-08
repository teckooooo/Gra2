import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import ReporteAltas from '@/Components/Comercial/ReporteAltas';
import ReporteBajas from '@/Components/Comercial/ReporteBajas';
import ReporteResumenAltasBajas from '@/Components/Comercial/ReporteResumenAltasBajas';

interface PageProps {
  auth: any;
  tipo?: 'Altas' | 'Bajas' | 'Resumen Altas y Bajas';
  datos?: any[];
  altas?: any[];
  bajas?: any[];
  [key: string]: any;
}

export default function ReportesComercial({ auth }: PageProps) {
  const { tipo, datos = [], altas = [], bajas = [] } = usePage<PageProps>().props;
  const opciones = ['Altas', 'Bajas', 'Resumen Altas y Bajas'];
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(tipo ?? null);

  const exportarPDFComercial = async () => {
    const imagenes: { titulo: string; base64: string }[] = [];
    const tablas: Record<string, any> = {};
  
    const idsCanvas: [string, string][] = [
      // ALTAS
      ['Gráfico Ejecutivo Altas', 'GraficoEjecutivoAltas'],
      ['Gráfico Sucursal Altas', 'GraficoSucursalAltas'],
      ['Gráfico Tipo OT Altas', 'GraficoTipoOTAltas'],
      ['Gráfico Mes/Sucursal Altas', 'GraficoMesSucursalAltas'],
      ['Gráfico Línea Altas', 'GraficoLineaAltas'],
  
      // BAJAS
      ['Gráfico Ejecutivo Bajas', 'GraficoEjecutivoBajas'],
      ['Gráfico Sucursal Bajas', 'GraficoSucursalBajas'],
      ['Gráfico Tipo OT Bajas', 'GraficoTipoOTBajas'],
      ['Gráfico Mes/Sucursal Bajas', 'GraficoMesSucursalBajas'],
      ['Gráfico Línea Bajas', 'GraficoLineaBajas'],
    ];
  
    idsCanvas.forEach(([titulo, id]) => {
      const canvas = document.getElementById(id)?.querySelector('canvas') as HTMLCanvasElement | null;
      if (canvas) {
        imagenes.push({
          titulo,
          base64: canvas.toDataURL('image/png'),
        });
      }
    });
  
  
    if (imagenes.length === 0 && Object.keys(tablas).length === 0) {
      alert('⚠️ No se encontraron datos para exportar.');
      return;
    }
  
    try {
      const response = await axios.post('/reportesComercial/pdf/exportar', {
        imagenes,
        tablas,
      }, {
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte_comercial.pdf';
      link.click();
    } catch (error) {
      console.error('❌ Error al exportar PDF:', error);
      alert('Error al generar el PDF.');
    }
  };


  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Reportes Comercial</h2>}
    >
      <Head title="Reportes Comercial" />
      <div className="flex min-h-screen">
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-4">
            <div>
              <p className="font-bold mb-2">Opciones</p>
              {opciones.map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => window.location.href = `/reportes-comercial/${opcion === 'Resumen Altas y Bajas' ? 'resumen' : opcion.toLowerCase()}`}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    opcionSeleccionada === opcion
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          {!opcionSeleccionada && (
            <div className="text-gray-600">Selecciona una opción desde el menú lateral para ver los reportes.</div>
          )}

          {opcionSeleccionada === 'Altas' && <ReporteAltas datos={datos} />}
          {opcionSeleccionada === 'Bajas' && <ReporteBajas datos={datos} />}

          {opcionSeleccionada === 'Resumen Altas y Bajas' && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={exportarPDFComercial}
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  📄 Exportar PDF
                </button>
              </div>
              <ReporteResumenAltasBajas altas={altas} bajas={bajas} />
            </>
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
