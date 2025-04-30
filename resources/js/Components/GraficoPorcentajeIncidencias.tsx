import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Props {
  datos: {
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
      }[];
    };
    options?: any;
  };
  show: boolean;
  onClose: () => void;
}

export default function GraficoPorcentajeIncidencias({ datos, show }: Props) {
  if (!show) return null;

  const opcionesConEtiquetas = {
    ...datos.options,
    layout: {
      padding: {
        top: 20,
        bottom: 30,
      },
    },
    plugins: {
      ...datos.options.plugins,
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        formatter: (value: number) => (value > 0 ? `${value}%` : null),
        clamp: true,
        clip: true,
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
            size: 13,
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
            size: 13,
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
    <div className="bg-white p-4 rounded-xl shadow w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Recuento de Frecuencia por Fecha e Incidencia</h2>
      <div style={{ height: '600px', minWidth: '700px' }}>
        <Bar data={datos.data} options={opcionesConEtiquetas} />
      </div>
    </div>
  );
}
