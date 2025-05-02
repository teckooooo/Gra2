import { useState } from 'react';
import GraficoSucursal from './GraficoSucursal';
import GraficoEjecutivo from './GraficoEjecutivo';
import GraficoTipoOT from './GraficoTipoOT';
import GraficoMesSucursal from './GraficoMesSucursal';

import ModalGraficoSucursal from './ModalGraficoSucursal';
import ModalGraficoTipoOT from './ModalGraficoTipoOT';
import ModalGraficoEjecutivo from './ModalGraficoEjecutivo';
import ModalGraficoMesSucursal from './ModalGraficoMesSucursal';

export default function ReporteAltas({ datos }: { datos: any[] }) {
  const [modalSucursal, setModalSucursal] = useState(false);
  const [modalTipoOT, setModalTipoOT] = useState(false);
  const [modalEjecutivo, setModalEjecutivo] = useState(false);
  const [modalMesSucursal, setModalMesSucursal] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Informe Comercial Altas</h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sucursal */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalSucursal(true)}
        >
          <GraficoSucursal datos={datos} />
        </div>

        {/* Ejecutivo */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalEjecutivo(true)}
        >
          <GraficoEjecutivo datos={datos} />
        </div>

        {/* Mes/Sucursal */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalMesSucursal(true)}
        >
          <GraficoMesSucursal datos={datos} />
        </div>

        {/* Tipo OT */}
        <div
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-[1.01] transition"
          onClick={() => setModalTipoOT(true)}
        >
          <GraficoTipoOT datos={datos} />
        </div>
      </div>

      {/* Modales */}
      <ModalGraficoSucursal
        show={modalSucursal}
        onClose={() => setModalSucursal(false)}
        datos={datos}
      />
      <ModalGraficoEjecutivo
        show={modalEjecutivo}
        onClose={() => setModalEjecutivo(false)}
        datos={datos}
      />
      <ModalGraficoMesSucursal
        show={modalMesSucursal}
        onClose={() => setModalMesSucursal(false)}
        datos={datos}
      />
      <ModalGraficoTipoOT
        show={modalTipoOT}
        onClose={() => setModalTipoOT(false)}
        datos={datos}
      />
    </div>
  );
}
