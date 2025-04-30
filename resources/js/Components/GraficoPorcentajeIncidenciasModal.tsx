import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any;
}

export default function GraficoPorcentajeIncidenciasModal({ show, onClose, datos }: Props) {
  // Calcular altura dinámica según la cantidad de incidencias visibles
  const heightDinamico = useMemo(() => {
    const datasetsVisibles = datos.data.datasets.filter((ds: any) => !ds.hidden);
    const cantidad = datasetsVisibles.length;
    if (cantidad > 8) return 600;
    if (cantidad > 5) return 500;
    if (cantidad > 3) return 400;
    return 300;
  }, [datos]);

  const opcionesConEtiquetas = {
    ...datos.options,
    plugins: {
      ...datos.options.plugins,
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
        formatter: (value: number) => (value > 0 ? `${value}%` : null),
        clamp: true,
      },
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#111',
          font: {
            size: 14,
          },
        },
        title: {
          display: true,
          text: 'Mes',
          color: '#111',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        stacked: true,
        max: 100,
        ticks: {
          color: '#111',
          font: {
            size: 14,
          },
          callback: (value: number) => `${value}%`,
        },
        title: {
          display: true,
          text: 'Recuento de Frecuencia (%)',
          color: '#111',
          font: {
            size: 14,
            weight: 'bold',
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
            <h3 className="text-xl font-bold mb-4">Recuento de Frecuencia por Fecha e Incidencia</h3>
            <div style={{ height: `${heightDinamico}px` }}>
              <Bar data={datos.data} options={opcionesConEtiquetas} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
