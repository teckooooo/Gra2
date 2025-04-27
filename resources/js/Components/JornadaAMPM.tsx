import { Bar } from 'react-chartjs-2';

interface JornadaAMPMProps {
    datos: any;
}

export default function JornadaAMPM({ datos }: JornadaAMPMProps) {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Jornada</h3>
            <div className="h-64">
                <Bar data={datos.data} options={datos.options} />
            </div>
        </div>
    );
}
