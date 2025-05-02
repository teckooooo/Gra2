import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function GraficoEjecutivo({ datos }: { datos: any[] }) {
  const agrupado: Record<string, number> = datos.reduce((acc, item) => {
    const key = item.ejecutivo || 'Sin dato';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // 🔽 Ordenar por cantidad (de mayor a menor)
  const ordenado = Object.entries(agrupado)
    .sort((a, b) => b[1] - a[1]);

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
      <h4 className="text-lg font-semibold mb-4">Suma de Cantidad por Ejecutiva/o</h4>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div style={{ height: `${labels.length * 48}px`, minWidth: '100%' }}>
          <Bar data={chartData} options={options as any} />
        </div>
      </div>
    </div>
  );
}
