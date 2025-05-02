import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ReporteAltas from '@/Components/Comercial/ReporteAltas';
import ReporteBajas from '@/Components/Comercial/ReporteBajas';
import ReporteResumenAltasBajas from '@/Components/Comercial/ReporteResumenAltasBajas';

interface PageProps {
    auth: any;
    tipo?: 'Altas' | 'Bajas' | 'Resumen Altas y Bajas';
    datos?: any[];
    altas?: any[];
    bajas?: any[];
    [key: string]: any; // <- ESTA LÍNEA SOLUCIONA EL ERROR
  }
  

export default function ReportesComercial({ auth }: PageProps) {
  const { tipo, datos = [], altas = [], bajas = [] } = usePage<PageProps>().props;
  const opciones = ['Altas', 'Bajas', 'Resumen Altas y Bajas'];
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(tipo ?? null);

  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Reportes Comercial</h2>}
    >
      <Head title="Reportes Comercial" />
      <div className="flex min-h-screen">
        {/* Menú lateral */}
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

        {/* Contenido principal */}
        <main className="flex-1 p-6 bg-gray-50">
          {!opcionSeleccionada && (
            <div className="text-gray-600">Selecciona una opción desde el menú lateral para ver los reportes.</div>
          )}

          {opcionSeleccionada === 'Altas' && <ReporteAltas datos={datos} />}
          {opcionSeleccionada === 'Bajas' && <ReporteBajas datos={datos} />}
          {opcionSeleccionada === 'Resumen Altas y Bajas' && (
            <ReporteResumenAltasBajas altas={altas} bajas={bajas} />
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
