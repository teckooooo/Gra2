import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

export default function GraficoTipoOT({ datos }: { datos: any[] }) {
  const agrupado = datos.reduce((acc, item) => {
    const key = item.tipo_ot || 'Otro';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(agrupado),
    datasets: [
      {
        data: Object.values(agrupado),
        backgroundColor: ['#3b82f6','#6366f1','#f97316']
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold mb-2">Cantidad por Tipo OT</h4>
      <Doughnut data={data} />
    </div>
  );
}
