import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface ModalGraficoSucursalProps {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function ModalGraficoSucursal({ show, onClose, datos }: ModalGraficoSucursalProps) {
  const agrupado: Record<string, number> = datos.reduce((acc, item) => {
    const key = item.sucursal || 'Sin dato';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const total = (Object.values(agrupado) as number[]).reduce((sum, v) => sum + v, 0);

  const coloresPorSucursal: Record<string, string> = {
    'Ovalle': '#3b82f6',
    'XII Región': '#1e1b4b',
    'Vicuña': '#f97316',
    'Monte Patria': '#7c3aed',
    'Salamanca': '#ec4899',
    'Combarbalá': '#6b7280',
    'Illapel': '#10b981',
    'Sin dato': '#a3a3a3'
  };

  const labels = Object.keys(agrupado);
  const values = Object.values(agrupado);
  const backgroundColors = labels.map(label => coloresPorSucursal[label] || '#cccccc');

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors
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
        <div className="fixed inset-0 flex items-center justify-center p-6 overflow-y-auto">
          <DialogPanel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-6xl transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Suma de Cantidad por Sucursal</h3>
              <button
                onClick={onClose}
                className="text-red-500 text-3xl font-bold hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-[500px]">
              <Doughnut data={data} options={options as any} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
