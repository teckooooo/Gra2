import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TablaUltimoDiaProps {
  show: boolean;
  onClose: () => void;
  datos: any[] | null | undefined;
  zonaId?: string;
  id?: string;
}

export default function TablaUltimoDia({
  show,
  onClose,
  datos,
  zonaId = 'general',
  id,
}: TablaUltimoDiaProps) {
  const tableId = id || `TablaUltimoDia-${zonaId}`;

  if (!Array.isArray(datos) || datos.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No hay datos disponibles para el Último Día.
      </div>
    );
  }

  const tabla = (id?: string) => (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Último Día</h3>
      <div className="max-h-[400px] overflow-y-auto rounded border">
        <table
          className="min-w-full text-sm text-left"
          {...(id ? { id } : {})}
        >
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4">Canal</th>
              <th className="py-2 px-4">Fecha</th>
              <th className="py-2 px-4">Incidencia</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{item.canal}</td>
                <td className="py-2 px-4">{item.fecha}</td>
                <td className="py-2 px-4">{item.incidencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!show) {
    return (
      <div id={tableId} className="w-full h-full">
        {tabla(tableId)}
      </div>
    );
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-5xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            {tabla(tableId)}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
