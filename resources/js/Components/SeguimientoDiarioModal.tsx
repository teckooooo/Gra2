import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function SeguimientoDiario({ show, onClose, datos }: Props) {
  // Clonar opciones y asegurar que sea responsivo
  const opcionesConEstilo = {
    ...datos.options,
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fondo oscuro */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        {/* Contenedor central */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-fit max-w-[95vw] max-h-[95vh] overflow-auto rounded-md bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Seguimiento diario</h3>
              <div style={{ width: '1000px', height: '600px' }}>
                <Bar data={datos.data} options={opcionesConEstilo} />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
