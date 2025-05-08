import React from 'react';
import { mesesOrden } from '@/utils/constantes'; // Asegúrate de que este archivo exporta los meses en orden

interface Props {
  datos?: any[];
  titulo?: string;
  id?: string;
}

export default function TablaCruzadaMesSucursal({
  datos = [],
  titulo = 'Tabla Resumen Altas y Bajas',
  id = 'TablaResumenAltasBajas',
}: Props) {
  const datosLimpios = datos.filter(d => d.mes && d.sucursal);

  const sucursales = [...new Set(datosLimpios.map(d => d.sucursal))];
  const meses = mesesOrden.filter(m =>
    datosLimpios.some(d => d.mes.toLowerCase() === m)
  );

  const resumen: Record<string, Record<string, number>> = {};
  datosLimpios.forEach(({ mes, sucursal }) => {
    const m = mes.toLowerCase();
    if (!resumen[m]) resumen[m] = {};
    resumen[m][sucursal] = (resumen[m][sucursal] || 0) + 1;
  });

  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto" id={id}>
      <h4 className="text-lg font-semibold mb-4">{titulo}</h4>
      <table className="min-w-full text-sm text-center border">
        <thead className="bg-gray-100 font-semibold">
          <tr>
            <th className="px-2 py-1 border">Mes</th>
            {sucursales.map(s => (
              <th key={s} className="px-2 py-1 border">{s}</th>
            ))}
            <th className="px-2 py-1 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {meses.map(mes => {
            const fila = resumen[mes] || {};
            const total = sucursales.reduce((acc, s) => acc + (fila[s] || 0), 0);
            return (
              <tr key={mes}>
                <td className="border px-2 py-1 font-semibold capitalize">{mes}</td>
                {sucursales.map(s => (
                  <td key={s} className="border px-2 py-1">{fila[s] || 0}</td>
                ))}
                <td className="border px-2 py-1 font-bold">{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
