export default function TablaIncidencias({ datos }: { datos: any[] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">📋 Incidencias</h3>
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="text-left p-2">Incidencia</th>
                        <th className="text-left p-2">Cantidad</th>
                        <th className="text-left p-2">%</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((item, index) => (
                        <tr key={index}>
                            <td className="border-t p-2">{item.nombre}</td>
                            <td className="border-t p-2">{item.cantidad}</td>
                            <td className="border-t p-2">{item.porcentaje}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
