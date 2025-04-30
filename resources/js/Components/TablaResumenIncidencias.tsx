import React from 'react';

interface Props {
datos: { incidencia: string; cantidad: number; porcentaje: string }[];
}

export default function TablaResumenIncidencias({ datos }: Props) {
    const total = datos.reduce((acc, fila) => acc + fila.cantidad, 0);

    return (
        <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">🚨 Incidencias registradas</h3>

        {/* Scrollable table wrapper */}
        <div className="max-h-[400px] overflow-y-auto rounded border">
            <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 font-semibold sticky top-0 z-10">
                <tr>
                <th className="border px-4 py-2 bg-gray-100">Incidencia</th>
                <th className="border px-4 py-2 text-center bg-gray-100">Cantidad</th>
                <th className="border px-4 py-2 text-center bg-gray-100">%</th>
                </tr>
            </thead>
            <tbody>
                {datos.map((fila, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{fila.incidencia}</td>
                    <td className="border px-4 py-2 text-center">{fila.cantidad}</td>
                    <td className="border px-4 py-2 text-center">{fila.porcentaje}</td>
                </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="font-semibold bg-gray-100">
                <td className="border px-4 py-2">Total</td>
                <td className="border px-4 py-2 text-center">{total}</td>
                <td className="border px-4 py-2 text-center">100%</td>
                </tr>
            </tfoot>
            </table>
        </div>
        </div>
    );
}
