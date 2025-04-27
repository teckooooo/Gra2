import { Bar } from 'react-chartjs-2';

export default function JornadaAMPM({ datos }: { datos: any }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">🌅 Jornada AM / PM</h3>
            <Bar data={datos.data} options={datos.options} />
        </div>
    );
}
