import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function GraficoLineaMesSucursal({ datos }: { datos: any[] }) {
  const colores: Record<string, string> = {
    'Ovalle': '#3b82f6',
    'XII Región': '#1e1b4b',
    'Vicuña': '#f97316',
    'Monte Patria': '#7c3aed',
    'Salamanca': '#ec4899',
    'Combarbalá': '#6b7280',
    'Illapel': '#10b981',
    'Sin dato': '#999999'
  };

  const mesesOrden = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const datosLimpios = datos.filter(d => d.mes && d.sucursal);

  const grouped: Record<string, Record<string, number>> = {};
  datosLimpios.forEach(({ mes, sucursal }) => {
    const mesLimpio = mes.toLowerCase();
    grouped[mesLimpio] = grouped[mesLimpio] || {};
    grouped[mesLimpio][sucursal] = (grouped[mesLimpio][sucursal] || 0) + 1;
  });

  const meses = mesesOrden.filter(m => Object.keys(grouped).includes(m));
  const sucursales = [...new Set(datosLimpios.map(d => d.sucursal))];

  const datasets = sucursales.map(sucursal => ({
    label: sucursal,
    borderColor: colores[sucursal] || '#000',
    backgroundColor: colores[sucursal] || '#000',
    data: meses.map(mes => grouped[mes]?.[sucursal] || 0),
    tension: 0.2,
    fill: false
  }));

  const data = {
    labels: meses.map(m => m[0].toUpperCase() + m.slice(1)),
    datasets
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="text-lg font-semibold mb-4">Suma de Cantidad por Mes y Sucursal</h4>
        <div id="GraficoLineaAltas" style={{ height: 300 }}>
          <Line data={data} options={{ responsive: true }} />
        </div>
    </div>
  );
}
