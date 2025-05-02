import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ReporteResumenAltasBajas({ altas, bajas }: { altas: any[], bajas: any[] }) {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const contarPorMes = (datos: any[]) => {
    return datos.reduce((acc, item) => {
      const mes = (item.mes || '').toLowerCase();
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const altasPorMes = contarPorMes(altas);
  const bajasPorMes = contarPorMes(bajas);

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold">Resumen Altas y Bajas</h3>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Suma de Cantidad por Mes y Sucursal</h4>
        <Line
          data={{
            labels: meses,
            datasets: [
              {
                label: 'Altas',
                data: meses.map((m) => altasPorMes[m] || 0),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.2)',
                tension: 0.4,
              },
              {
                label: 'Bajas',
                data: meses.map((m) => bajasPorMes[m] || 0),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.2)',
                tension: 0.4,
              }
            ]
          }}
        />
      </div>
    </div>
  );
}
