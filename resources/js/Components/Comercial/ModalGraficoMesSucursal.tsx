import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function ModalGraficoMesSucursal({ show, onClose, datos }: Props) {
  const sucursales = ['Combarbalá', 'Illapel', 'Monte Patria', 'Ovalle', 'Salamanca', 'Vicuña', 'XII Región'];
  const colores: Record<string, string> = {
    'Ovalle': '#3b82f6',
    'XII Región': '#1e1b4b',
    'Vicuña': '#f97316',
    'Monte Patria': '#7c3aed',
    'Salamanca': '#ec4899',
    'Combarbalá': '#6b7280',
    'Illapel': '#10b981'
  };

  const mesesOrden = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  const datosLimpios = datos.filter(d =>
    d.mes && mesesOrden.includes(d.mes?.toLowerCase()) &&
    d.sucursal && sucursales.includes(d.sucursal) &&
    !isNaN(Number(d.cantidad))
  );

  const mesesPresentes = [...new Set(datosLimpios.map(d => d.mes.toLowerCase()))]
    .sort((a, b) => mesesOrden.indexOf(a) - mesesOrden.indexOf(b));

  const grouped: Record<string, Record<string, number>> = {};
  datosLimpios.forEach(({ mes, sucursal, cantidad }) => {
    const m = mes.toLowerCase();
    const cant = Number(cantidad);
    if (!grouped[m]) grouped[m] = {};
    grouped[m][sucursal] = (grouped[m][sucursal] || 0) + cant;
  });

  const totalPorMes = mesesPresentes.map(mes =>
    sucursales.reduce((sum, suc) => sum + (grouped[mes]?.[suc] || 0), 0)
  );

  const datasets = sucursales.map(sucursal => ({
    label: sucursal,
    backgroundColor: colores[sucursal] || '#999',
    data: mesesPresentes.map(mes => grouped[mes]?.[sucursal] || 0),
    datalabels: { display: false }
  }));

  const chartData = {
    labels: mesesPresentes.map(m => m[0].toUpperCase() + m.slice(1)),
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: { size: 12 },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`
        }
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        color: '#000',
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (_: any, context: any) => {
          const idx = context.dataIndex;
          const datasetIdx = context.datasetIndex;
          const isTop = datasetIdx === chartData.datasets.length - 1 ||
            chartData.datasets.slice(datasetIdx + 1).every(ds => ds.data[idx] === 0);
          return isTop ? totalPorMes[idx] : '';
        }
      }
      
      
      
      
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: { weight: 'bold', size: 12 }
        },
        title: {
          display: true,
          text: 'Mes',
          font: { weight: 'bold', size: 14 }
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Suma de Cantidad',
          font: { weight: 'bold', size: 14 }
        },
        ticks: {
          font: { weight: 'bold', size: 12 }
        }
      }
    },
    layout: {
      padding: 10
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">Suma de Cantidad por Mes y Sucursal</h3>
            <div style={{ height: '500px' }}>
              <Bar data={chartData} options={options} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
