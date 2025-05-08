import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function GraficoEjecutivo({
  datos,
  id,
  limitarTop10 = false
}: {
  datos: any[];
  id?: string;
  limitarTop10?: boolean;
}) {
  const agrupado: Record<string, number> = datos.reduce((acc, item) => {
    const key = item.ejecutivo || 'Sin dato';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  let ordenado = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);

  // 👇 Solo si estamos en modo exportación
  if (limitarTop10) {
    ordenado = ordenado.slice(0, 10);
  }

  const labels = ordenado.map(([key]) => key);
  const values = ordenado.map(([, value]) => value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Suma de Cantidad',
        data: values,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        barThickness: 30,
        categoryPercentage: 1.0,
        barPercentage: 1.0
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Cantidad: ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#111827',
          font: { weight: 'bold' }
        },
        title: {
          display: true,
          text: 'Suma de Cantidad',
          font: { weight: 'bold' }
        },
        grid: {
          drawBorder: false,
          color: '#e5e7eb'
        }
      },
      y: {
        ticks: {
          color: '#111827',
          font: { weight: 'bold' }
        },
        title: {
          display: true,
          text: 'Ejecutiva/o',
          font: { weight: 'bold' }
        },
        grid: { display: false }
      }
    },
    layout: {
      padding: 10
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="text-lg font-semibold mb-4">
        {limitarTop10 ? 'Top 10 Ejecutivos/as' : 'Suma de Cantidad por Ejecutiva/o'}
      </h4>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div style={{ height: `${labels.length * 48}px`, minWidth: '100%' }} id={id}>
          <Bar data={chartData} options={options as any} />
        </div>
      </div>
    </div>
  );
}
