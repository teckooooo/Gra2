import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { mesesOrden } from '@/utils/constantes';

interface Props {
  show: boolean;
  onClose: () => void;
  datos?: any[];
  titulo?: string;
}

export default function ModalTablaCruzadaMesSucursal({ show, onClose, datos = [], titulo = 'Tabla Resumen Altas y Bajas' }: Props) {
  const datosLimpios = datos.filter(d => d.mes && d.sucursal);

  const sucursales = [...new Set(datosLimpios.map(d => d.sucursal))];
  const meses = mesesOrden.filter(m =>
    datosLimpios.some(d => d.mes.toLowerCase() === m)
  );

  const resumen: Record<string, Record<string, number>> = {};
  datosLimpios.forEach(({ mes, sucursal }) => {
    const m = mes.toLowerCase();
    if (!resumen[m]) resumen[m] = {};
    resumen[m][sucursal] = (resumen[m][sucursal] || 0) + 1;
  });

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">{titulo}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center border">
                <thead className="bg-gray-100 font-semibold">
                  <tr>
                    <th className="px-2 py-1 border">Mes</th>
                    {sucursales.map(s => (
                      <th key={s} className="px-2 py-1 border">{s}</th>
                    ))}
                    <th className="px-2 py-1 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {meses.map(mes => {
                    const fila = resumen[mes] || {};
                    const total = sucursales.reduce((acc, s) => acc + (fila[s] || 0), 0);
                    return (
                      <tr key={mes}>
                        <td className="border px-2 py-1 font-semibold capitalize">{mes}</td>
                        {sucursales.map(s => (
                          <td key={s} className="border px-2 py-1">{fila[s] || 0}</td>
                        ))}
                        <td className="border px-2 py-1 font-bold">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
