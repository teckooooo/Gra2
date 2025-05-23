import { Dialog, Transition } from '@headlessui/react';
import { Fragment, PropsWithChildren } from 'react';

export default function Modal({
  children,
  show = false,
  closeable = true,
  onClose = () => {},
}: PropsWithChildren<{
  show: boolean;
  closeable?: boolean;
  onClose: CallableFunction;
}>) {
  const close = () => {
    if (closeable) {
      onClose();
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
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

        {/* Centrado de contenido */}
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
            {/* SOLO ESTA TARJETA, no hay doble fondo */}
            <Dialog.Panel className="w-fit max-w-[95vw] max-h-[95vh] overflow-auto rounded-md bg-white p-6 shadow-xl">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
