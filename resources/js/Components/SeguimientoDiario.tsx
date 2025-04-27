import { Bar } from 'react-chartjs-2';

interface SeguimientoDiarioProps {
    datos: any;
}

export default function SeguimientoDiario({ datos }: SeguimientoDiarioProps) {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Seguimiento diario</h3>
            <div className="h-64">
                <Bar data={datos.data} options={datos.options} />
            </div>
        </div>
    );
}
