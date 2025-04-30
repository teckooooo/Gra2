import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TablaIncidenciasProps {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function TablaIncidencias({ show, onClose, datos }: TablaIncidenciasProps) {
  const contenido = (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Incidencias</h3>
      <div className="max-h-[400px] overflow-y-auto rounded border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4">Incidencia</th>
              <th className="py-2 px-4">Cantidad</th>
              <th className="py-2 px-4">%</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{item.nombre}</td>
                <td className="py-2 px-4">{item.cantidad}</td>
                <td className="py-2 px-4">{item.porcentaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!show) {
    return <div className="w-full h-full">{contenido}</div>;
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-5xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            {contenido}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
