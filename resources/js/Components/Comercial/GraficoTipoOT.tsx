import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

export default function GraficoTipoOT({ datos }: { datos: any[] }) {
  const agrupado = datos.reduce((acc, item) => {
    let key = item.tipo_ot || 'Otro';

    // Agrupar todos los que contienen "FTTH" como "FTTH"
    if (key.toLowerCase().includes('ftth')) {
      key = 'FTTH';
    }

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colores = ['#3b82f6', '#6366f1', '#f97316', '#10b981', '#e11d48', '#6b7280', '#a855f7', '#1e40af', '#f59e0b'];

  const data = {
    labels: Object.keys(agrupado),
    datasets: [
      {
        data: Object.values(agrupado),
        backgroundColor: colores.slice(0, Object.keys(agrupado).length)
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
