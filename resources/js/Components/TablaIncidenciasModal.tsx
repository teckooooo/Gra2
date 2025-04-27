import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TablaIncidenciasProps {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function TablaIncidencias({ show, onClose, datos }: TablaIncidenciasProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <h3 className="text-2xl font-bold mb-6">Incidencias</h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100">
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

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
