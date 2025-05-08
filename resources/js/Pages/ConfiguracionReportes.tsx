import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Hora {
  id: number;
  hora: string;
}

interface PageProps {
  auth: any;
  horas: Hora[];
}

export default function ConfiguracionReportes({ auth, horas }: PageProps) {
  const [nuevaHora, setNuevaHora] = useState('');
  const [horasEnvio, setHorasEnvio] = useState<Hora[]>([]);

  useEffect(() => {
    if (Array.isArray(horas)) {
      const ordenadas = [...horas].sort((a, b) => a.hora.localeCompare(b.hora));
      setHorasEnvio(ordenadas);
    }
  }, [horas]);

  const agregarHora = () => {
    if (!nuevaHora) return;
    if (horasEnvio.some(h => h.hora === nuevaHora)) {
      toast.error('⚠️ Esa hora ya existe');
      return;
    }

    router.post('/configuracion-reportes', { hora: nuevaHora }, {
      onSuccess: () => {
        toast.success('✅ Hora agregada');
        setNuevaHora('');
        router.reload({ only: ['horas'] });
      }
    });
  };

  const editarHora = (id: number, nueva: string) => {
    router.put(`/configuracion-reportes/${id}`, { hora: nueva }, {
      onSuccess: () => {
        toast.success('✏️ Hora actualizada');
        router.reload({ only: ['horas'] });
      }
    });
  };

  const eliminarHora = (id: number) => {
    if (!confirm('¿Eliminar esta hora?')) return;

    router.delete(`/configuracion-reportes/${id}`, {
      onSuccess: () => {
        toast.success('🗑️ Hora eliminada');
        router.reload({ only: ['horas'] });
      }
    });
  };

  return (
    <>
      <Head title="Configuración de Reportes" />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🕓 Configuración de envío de reportes</h1>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="time"
            value={nuevaHora}
            onChange={(e) => setNuevaHora(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={agregarHora}
            className="bg-blue-600 text-white px-4 py-1 rounded shadow"
          >
            Añadir hora
          </button>
        </div>

        <div className="mb-6">
          {horasEnvio.length > 0 ? (
            <table className="min-w-[300px] border border-gray-300 rounded">
              <thead className="bg-gray-100 text-left text-sm font-semibold">
                <tr>
                  <th className="p-2 border-b">#</th>
                  <th className="p-2 border-b">Hora</th>
                  <th className="p-2 border-b text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {horasEnvio.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{index + 1}</td>
                    <td className="p-2 border-b">
                      <input
                        type="time"
                        value={item.hora}
                        onChange={(e) => editarHora(item.id, e.target.value)}
                        className="border rounded px-2 py-1 w-28"
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        onClick={() => eliminarHora(item.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm italic text-gray-500">No hay horas almacenadas aún.</p>
          )}
        </div>
      </div>
    </>
  );
}
