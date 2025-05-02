import GraficoSucursal from './GraficoSucursal';
import GraficoEjecutivo from './GraficoEjecutivo';
import GraficoTipoOT from './GraficoTipoOT';
import GraficoMesSucursal from './GraficoMesSucursal';

export default function ReporteBajas({ datos }: { datos: any[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Informe Comercial Altas</h3>

      {/* Grilla de 2x2 con escala reducida */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="transform scale-60 origin-top-left">
          <GraficoSucursal datos={datos} />
        </div>
        <div className="transform scale-90 origin-top-left">
          <GraficoEjecutivo datos={datos} />
        </div>
        <div className="transform scale-90 origin-top-left">
          <GraficoMesSucursal datos={datos} />
        </div>
        <div className="transform scale-60 origin-top-left">
          <GraficoTipoOT datos={datos} />
        </div>
      </div>
    </div>
  );
}
