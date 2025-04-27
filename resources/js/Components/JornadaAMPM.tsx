import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';

interface JornadaAMPMProps {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function JornadaAMPM({ show, onClose, datos }: JornadaAMPMProps) {
  const contenido = (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-4">Jornada</h3>
      <Bar data={datos.data} options={datos.options} />
    </div>
  );

  if (!show) {
    // Mostrar directamente en la grilla
    return contenido;
  }

  // Mostrar en un Modal
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            {contenido}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
