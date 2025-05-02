import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { parse } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function GraficoMesSucursal({ datos }: { datos: any[] }) {
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

  // Extraer mes desde 'periodo' y setear cantidad = 1
  datos.forEach((d) => {
    if (d.periodo && !d.mes) {
      const fecha = parse(d.periodo, 'dd/MM/yyyy', new Date(), { locale: es });
      const mes = fecha.toLocaleString('es-CL', { month: 'long' });
      d.mes = mes.toLowerCase();
    }
    if (!d.cantidad) {
      d.cantidad = 1;
    }
  });

  const datosLimpios = datos.filter(d =>
    d.mes && mesesOrden.includes(d.mes?.toLowerCase()) &&
    d.sucursal && sucursales.includes(d.sucursal) &&
    !isNaN(Number(d.cantidad))
  );

  const mesesPresentes = [...new Set(datosLimpios.map(d => d.mes.toLowerCase()))]
    .sort((a, b) => mesesOrden.indexOf(a) - mesesOrden.indexOf(b));

  const grouped: Record<string, Record<string, number>> = {};
  datosLimpios.forEach(({ mes, sucursal, cantidad }) => {
    const mesLimpio = mes.toLowerCase();
    const cant = Number(cantidad);
    if (!grouped[mesLimpio]) grouped[mesLimpio] = {};
    grouped[mesLimpio][sucursal] = (grouped[mesLimpio][sucursal] || 0) + cant;
  });

  const totalPorMes = mesesPresentes.map(mes =>
    sucursales.reduce((sum, suc) => sum + (grouped[mes]?.[suc] || 0), 0)
  );

  const datasets = sucursales.map(sucursal => ({
    label: sucursal,
    backgroundColor: colores[sucursal] || '#999',
    data: mesesPresentes.map(mes => grouped[mes]?.[sucursal] || 0),
    datalabels: {
      display: false
    }
  }));

  const data = {
    labels: mesesPresentes.map(m => m[0].toUpperCase() + m.slice(1)),
    datasets
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: { size: 14 },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000',
        font: {
          size: 14,
          weight: 'bold'
        },
        formatter: (_: any, context: any) => {
          const idx = context.dataIndex;
          const datasetIdx = context.datasetIndex;
          const isTop = datasetIdx === data.datasets.length - 1 ||
            data.datasets.slice(datasetIdx + 1).every(ds => ds.data[idx] === 0);
          return isTop ? totalPorMes[idx] : '';
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: { weight: 'bold', size: 13 }
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
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="text-lg font-semibold mb-4">Suma de Cantidad por Mes y Sucursal</h4>
      <div style={{ height: '420px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
