import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';

interface JornadaAMPMProps {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function JornadaAMPM({ show, onClose, datos }: JornadaAMPMProps) {
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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <h3 className="text-2xl font-bold mb-6">Jornada AM/PM</h3>
                <div className="h-[600px]">
                  <Bar data={datos.data} options={datos.options} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
