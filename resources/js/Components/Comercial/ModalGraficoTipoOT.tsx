import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface ModalGraficoTipoOTProps {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function ModalGraficoTipoOT({ show, onClose, datos }: ModalGraficoTipoOTProps) {
  // Agrupar por tipo OT, unificando FTTH
  const agrupado: Record<string, number> = datos.reduce((acc, item) => {
    let key = item.tipo_ot || 'Otro';
    if (key.toLowerCase().includes('ftth')) key = 'FTTH';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const total: number = Object.values(agrupado).reduce((sum, val) => sum + val, 0);

  const colores = ['#3b82f6', '#6366f1', '#f97316', '#10b981', '#e11d48', '#6b7280', '#a855f7', '#1e40af', '#f59e0b'];

  const data = {
    labels: Object.keys(agrupado),
    datasets: [
      {
        data: Object.values(agrupado),
        backgroundColor: colores.slice(0, Object.keys(agrupado).length)
      }
    ]
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value: number) => {
          const porcentaje = ((value / total) * 100).toFixed(2);
          const miles = value >= 1000 ? `${(value / 1000).toFixed(0)} mil` : value;
          return `${miles} (${porcentaje}%)`;
        },
        font: {
          weight: 'bold',
          size: 14
        },
        anchor: 'end',
        align: 'start',
        offset: 10,
        clamp: true
      },
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const porcentaje = ((value / total) * 100).toFixed(2);
            return `${value} (${porcentaje}%)`;
          }
        }
      }
    },
    layout: {
      padding: 10
    },
    cutout: '60%'
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-4xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">Cantidad por Tipo OT</h3>
            <div style={{ height: '500px' }}>
              <Doughnut data={data} options={options as any} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
