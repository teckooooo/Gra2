interface TablaUltimoDiaProps {
    datos: any[];
}

export default function TablaUltimoDia({ datos }: TablaUltimoDiaProps) {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Último Día</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4">Canal</th>
                            <th className="py-2 px-4">Fecha</th>
                            <th className="py-2 px-4">Incidencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-4">{item.canal}</td>
                                <td className="py-2 px-4">{item.fecha}</td>
                                <td className="py-2 px-4">{item.incidencia}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
