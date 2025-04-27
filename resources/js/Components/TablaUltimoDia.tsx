import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TablaUltimoDiaProps {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function TablaUltimoDia({ show, onClose, datos }: TablaUltimoDiaProps) {
  const contenido = (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Último Día</h3>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100">
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
  );

  if (!show) {
    // Mostrar directamente en la vista
    return (
      <div className="w-full h-full">
        {contenido}
      </div>
    );
  }

  // Mostrar dentro de Modal
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
