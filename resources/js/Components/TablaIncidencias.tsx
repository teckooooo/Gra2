interface TablaIncidenciasProps {
    datos: any[];
}

export default function TablaIncidencias({ datos }: TablaIncidenciasProps) {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Incidencias</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4">Incidencia</th>
                            <th className="py-2 px-4">Cantidad</th>
                            <th className="py-2 px-4">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-4">{item.nombre}</td>
                                <td className="py-2 px-4">{item.cantidad}</td>
                                <td className="py-2 px-4">{item.porcentaje}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
