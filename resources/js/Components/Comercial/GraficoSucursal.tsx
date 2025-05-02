import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

export default function GraficoSucursal({ datos }: { datos: any[] }) {
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
          size: 12
        },
        anchor: 'end',
        align: 'start',
        offset: 10,
        clamp: true
      },
      legend: {
        position: 'right',
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
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold mb-4">Suma de Cantidad por Sucursal</h4>
      <Doughnut data={data} options={options as any} />
    </div>
  );
}
