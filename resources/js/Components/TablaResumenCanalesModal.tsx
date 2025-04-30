import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  show: boolean;
  onClose: () => void;
  datos: { canal: string; cantidad: number; porcentaje: string }[];
}

export default function TablaResumenCanalesModal({ show, onClose, datos }: Props) {
  const total = datos.reduce((acc, fila) => acc + fila.cantidad, 0);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-4xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">📺 Canales con más incidencias</h3>

            <div className="max-h-[500px] overflow-y-auto rounded border">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="border px-4 py-2 bg-gray-100">Canal</th>
                    <th className="border px-4 py-2 text-center bg-gray-100">Cantidad</th>
                    <th className="border px-4 py-2 text-center bg-gray-100">%</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((fila, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{fila.canal}</td>
                      <td className="border px-4 py-2 text-center">{fila.cantidad}</td>
                      <td className="border px-4 py-2 text-center">{fila.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-gray-100">
                    <td className="border px-4 py-2">Total</td>
                    <td className="border px-4 py-2 text-center">{total}</td>
                    <td className="border px-4 py-2 text-center">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
