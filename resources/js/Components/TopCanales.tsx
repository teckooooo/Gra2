import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Registrar componentes básicos
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function TopCanales({ show, onClose, datos }: Props) {
  const opcionesBase: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        display: false, // No mostrar números en la vista normal
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  const opcionesConDatalabels: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        display: true, // Activar números en modal
        color: '#000',
        anchor: 'center',
        align: 'center',
        font: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          // Tamaño dinámico: si el número es grande, letra más chica
          if (value >= 20) {
            return { size: 10, weight: 'bold' };
          } else if (value >= 10) {
            return { size: 12, weight: 'bold' };
          } else {
            return { size: 14, weight: 'bold' };
          }
        },
        formatter: (value: number) => (value > 0 ? value : ''),
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  if (!show) {
    // Tarjeta normal (sin números)
    return (
      <div className="w-full h-full">
        <h3 className="text-lg font-semibold mb-4">Top Canales</h3>
        <Bar data={datos.data} options={opcionesBase} plugins={[]} />
      </div>
    );
  }

  // Modal (con números y tamaño dinámico)
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-7xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-4">Top Canales</h3>
            <Bar data={datos.data} options={opcionesConDatalabels} plugins={[ChartDataLabels]} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
