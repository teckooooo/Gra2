import { Bar } from 'react-chartjs-2';

export default function SeguimientoDiario({ datos }: { datos: any }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">📅 Seguimiento diario</h3>
            <Bar data={datos.data} options={datos.options} />
        </div>
    );
}
