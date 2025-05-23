import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Hora {
  id: number;
  hora: string;
}

export default function ConfiguracionReportes() {
  const [nuevaHora, setNuevaHora] = useState('');
  const [horasEnvio, setHorasEnvio] = useState<Hora[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [horaEditada, setHoraEditada] = useState<string>('');

  const cargarHoras = async () => {
    try {
      const res = await fetch('/configuracion/horas');
      const data = await res.json();
      const ordenadas = (data as Hora[])
        .map((h, i) => ({ id: h.id ?? i + 1, hora: h.hora }))
        .sort((a, b) => a.hora.localeCompare(b.hora));
      setHorasEnvio(ordenadas);
    } catch (err) {
      console.error('❌ Error al cargar las horas:', err);
      toast.error('No se pudieron cargar las horas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHoras();
  }, []);

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
        cargarHoras();
      },
      onError: (errors) => {
  if (errors.hora) {
    toast.error(`⚠️ ${errors.hora}`);
  } else {
    toast.error('❌ Error al agregar la hora');
  }
}
,
    });
  };

  const editarHora = async (id: number, nueva: string) => {
    const horaFormateada = nueva + ':00';
    const yaExiste = horasEnvio.some(h => h.hora === horaFormateada && h.id !== id);
    if (yaExiste) {
      toast.error('⚠️ Esa hora ya existe');
      return;
    }

    router.put(`/configuracion-reportes/${id}`, { hora: horaFormateada }, {
      onSuccess: () => {
        toast.success('✏️ Hora actualizada');
        cargarHoras();
        setEditandoId(null);
      },
      onError: () => {
        toast.error('❌ Error al actualizar la hora');
      },
    });
  };

  const eliminarHora = (id: number) => {
    if (!confirm('¿Eliminar esta hora?')) return;

    router.delete(`/configuracion-reportes/${id}`, {
      onSuccess: () => {
        toast.success('🗑️ Hora eliminada');
        cargarHoras();
      },
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

        <div className="overflow-x-auto bg-white p-4 rounded shadow">
          {cargando ? (
            <p className="text-sm italic text-gray-500">Cargando horas...</p>
          ) : horasEnvio.length === 0 ? (
            <p className="text-sm italic text-gray-500">No hay horas registradas.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Hora</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {horasEnvio.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {editandoId === item.id ? (
                        <input
                          type="time"
                          value={horaEditada}
                          onChange={(e) => setHoraEditada(e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        item.hora.slice(0, 5)
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {editandoId === item.id ? (
                        <>
                          <button
                            onClick={() => editarHora(item.id, horaEditada)}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="text-gray-500 hover:underline text-sm"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                        {/*
                          <button
                            onClick={() => {
                              setEditandoId(item.id);
                              setHoraEditada(item.hora.slice(0, 5));
                            }}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Editar
                          </button>
                          */}
                          <button
                            onClick={() => eliminarHora(item.id)}
                            className="text-red-600 hover:underline text-sm"
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
          )}
        </div>
      </div>
    </>
  );
}
