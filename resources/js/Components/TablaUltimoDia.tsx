export default function TablaUltimoDia({ datos }: { datos: any[] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">📋 Último Día</h3>
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="text-left p-2">Canal</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Incidencia</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((item, index) => (
                        <tr key={index}>
                            <td className="border-t p-2">{item.canal}</td>
                            <td className="border-t p-2">{item.fecha}</td>
                            <td className="border-t p-2">{item.incidencia}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
