import { Bar } from 'react-chartjs-2';

interface Props {
  datos: any;
  width?: number;
  height?: number;
}

export default function TopCanales({ datos, width = 400, height = 300 }: Props) {
  return (
    <div className="w-full h-full">
        <h3 className="text-lg font-semibold mb-4">Seguimiento diario</h3>
      <Bar data={datos.data} options={datos.options} width={width} height={height} />
    </div>
  );
}
