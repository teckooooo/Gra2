import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar plugin
Chart.register(ChartDataLabels);

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function SeguimientoDiario({ show, onClose, datos }: Props) {


  const opcionesConEtiquetas = {
    ...datos.options,
    plugins: {
      ...datos.options.plugins,
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: () => '#fff',
        font: {
          weight: 'bold' as const,
          size: 18,
        },
        formatter: (value: number) => (value === 0 ? null : value),
      },
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#111',
          font: {
            size: 14,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#111',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">Seguimiento Diario</h3>
            <div style={{ height: '500px' }}>
              <Bar data={datos.data} options={opcionesConEtiquetas} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
