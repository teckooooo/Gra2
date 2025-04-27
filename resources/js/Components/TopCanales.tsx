import { Bar } from 'react-chartjs-2';

export default function TopCanales({ datos }: { datos: any }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">🏆 Top 10 canales con más fallas</h3>
            <Bar data={datos.data} options={datos.options} />
        </div>
    );
}
