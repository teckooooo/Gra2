import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function SeguimientoDiario({ show, onClose, datos }: Props) {
  if (!show) {
    // Vista normal en la grilla
    return (
      <div className="w-full h-full">
        <h3 className="text-lg font-semibold mb-4">Seguimiento diario</h3>
        <Bar data={datos.data} options={datos.options} />
      </div>
    );
  }

  // Vista en Modal
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-7xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-4">Seguimiento diario</h3>
            <Bar data={datos.data} options={datos.options} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
