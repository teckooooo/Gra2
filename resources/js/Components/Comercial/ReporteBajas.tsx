import { useState } from 'react';
import GraficoSucursal from './GraficoSucursal';
import GraficoEjecutivo from './GraficoEjecutivo';
import GraficoTipoOT from './GraficoTipoOT';
import GraficoMesSucursal from './GraficoMesSucursal';

import ModalGraficoSucursal from './ModalGraficoSucursal';
import ModalGraficoEjecutivo from './ModalGraficoEjecutivo';
import ModalGraficoTipoOT from './ModalGraficoTipoOT';
import ModalGraficoMesSucursal from './ModalGraficoMesSucursal';

export default function ReporteBajas({ datos }: { datos: any[] }) {
  const datosNormalizados = datos.map(d => ({
    sucursal: d.comuna || 'Sin dato',
    ejecutivo: d.nombre || 'Sin dato',
    tipo_ot: d.plan || 'Sin dato',
    mes: d.fecha_de_termino
      ? new Date(d.fecha_de_termino.split('/').reverse().join('-')).toLocaleString('es-CL', { month: 'long' })
      : 'Sin dato',
    cantidad: 1
  }));

  const [modalSucursal, setModalSucursal] = useState(false);
  const [modalEjecutivo, setModalEjecutivo] = useState(false);
  const [modalTipoOT, setModalTipoOT] = useState(false);
  const [modalMesSucursal, setModalMesSucursal] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Informe Comercial Bajas</h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sucursal */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalSucursal(true)}
        >
          <GraficoSucursal datos={datosNormalizados} />
        </div>

        {/* Ejecutivo */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalEjecutivo(true)}
        >
          <GraficoEjecutivo datos={datosNormalizados} />
        </div>

        {/* Mes/Sucursal */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalMesSucursal(true)}
        >
          <GraficoMesSucursal datos={datosNormalizados} />
        </div>

        {/* Tipo OT */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalTipoOT(true)}
        >
          <GraficoTipoOT datos={datosNormalizados} />
        </div>
      </div>

      {/* Modales */}
      <ModalGraficoSucursal
        show={modalSucursal}
        onClose={() => setModalSucursal(false)}
        datos={datosNormalizados}
      />
      <ModalGraficoEjecutivo
        show={modalEjecutivo}
        onClose={() => setModalEjecutivo(false)}
        datos={datosNormalizados}
      />
      <ModalGraficoMesSucursal
        show={modalMesSucursal}
        onClose={() => setModalMesSucursal(false)}
        datos={datosNormalizados}
      />
      <ModalGraficoTipoOT
        show={modalTipoOT}
        onClose={() => setModalTipoOT(false)}
        datos={datosNormalizados}
      />
    </div>
  );
}
