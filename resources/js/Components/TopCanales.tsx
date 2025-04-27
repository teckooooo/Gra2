import { Bar } from 'react-chartjs-2';

interface TopCanalesProps {
    datos: any;
}

export default function TopCanales({ datos }: TopCanalesProps) {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Los 10 Canales con más Fallas</h3>
            <div className="h-80 overflow-x-auto">
                <Bar data={datos.data} options={datos.options} />
            </div>
        </div>
    );
}
