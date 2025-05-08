import React, { useState } from 'react';
import GraficoSucursal from './GraficoSucursal';
import GraficoEjecutivo from './GraficoEjecutivo';
import GraficoTipoOT from './GraficoTipoOT';
import GraficoMesSucursal from './GraficoMesSucursal';
import TablaCruzadaMesSucursal from './TablaCruzadaMesSucursal';
import GraficoLineaMesSucursal from './GraficoLineaMesSucursal';
import ModalGraficoLineaMesSucursal from './ModalGraficoLineaMesSucursal';
import ModalTablaCruzadaMesSucursal from './ModalTablaCruzadaMesSucursal';

import ModalGraficoSucursal from './ModalGraficoSucursal';
import ModalGraficoEjecutivo from './ModalGraficoEjecutivo';
import ModalGraficoTipoOT from './ModalGraficoTipoOT';
import ModalGraficoMesSucursal from './ModalGraficoMesSucursal';

// ... imports iguales
export default function ReporteResumenAltasBajas({
  altas = [],
  bajas = [],
}: {
  altas: any[];
  bajas: any[];
}) {
  const [modalAltasLinea, setModalAltasLinea] = useState(false);
  const [modalBajasLinea, setModalBajasLinea] = useState(false);
  const [modalAltasTabla, setModalAltasTabla] = useState(false);
  const [modalBajasTabla, setModalBajasTabla] = useState(false);

  const [modalSucursalAltas, setModalSucursalAltas] = useState(false);
  const [modalEjecutivoAltas, setModalEjecutivoAltas] = useState(false);
  const [modalTipoOTAltas, setModalTipoOTAltas] = useState(false);
  const [modalMesSucursalAltas, setModalMesSucursalAltas] = useState(false);

  const [modalSucursalBajas, setModalSucursalBajas] = useState(false);
  const [modalEjecutivoBajas, setModalEjecutivoBajas] = useState(false);
  const [modalTipoOTBajas, setModalTipoOTBajas] = useState(false);
  const [modalMesSucursalBajas, setModalMesSucursalBajas] = useState(false);

  const bajasNormalizadas = bajas.map((d) => {
    const plan = (d.plan || '').toLowerCase();
    const tipo_ot = plan.includes('ftth') ? 'FTTH' : (d.plan || 'Sin dato');

    return {
      sucursal: d.comuna || 'Sin dato',
      ejecutivo: d.nombre || 'Sin dato',
      tipo_ot,
      mes: d.fecha_de_termino
        ? new Date(d.fecha_de_termino.split('/').reverse().join('-')).toLocaleString('es-CL', {
            month: 'long',
          })
        : 'Sin dato',
      cantidad: 1,
    };
  });

  const altasNormalizadas = altas.map((d) => ({
    sucursal: d.sucursal || 'Sin dato',
    ejecutivo: d.ejecutivo || 'Sin dato',
    tipo_ot: d.tipo_ot || 'Sin dato',
    mes: d.periodo
      ? new Date(d.periodo.split('/').reverse().join('-')).toLocaleString('es-CL', {
          month: 'long',
        })
      : 'Sin dato',
    cantidad: parseInt(d.cantidad) || 0,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Resumen Altas y Bajas</h3>

      {/* ALTAS - Línea y Tabla */}
      <div className="grid md:grid-cols-2 gap-4">
        <div onClick={() => setModalAltasLinea(true)}>
          <GraficoLineaMesSucursal datos={altasNormalizadas} id="GraficoLineaAltas" />
        </div>
        <div onClick={() => setModalAltasTabla(true)}>
          <TablaCruzadaMesSucursal datos={altasNormalizadas} titulo="Altas por Mes y Sucursal" />
        </div>
      </div>

      {/* BAJAS - Línea y Tabla */}
      <div className="grid md:grid-cols-2 gap-4">
        <div onClick={() => setModalBajasLinea(true)}>
          <GraficoLineaMesSucursal datos={bajasNormalizadas} id="GraficoLineaBajas" />
        </div>
        <div onClick={() => setModalBajasTabla(true)}>
          <TablaCruzadaMesSucursal datos={bajasNormalizadas} titulo="Bajas por Mes y Sucursal" />
        </div>
      </div>

      {/* ALTAS - Otros gráficos */}
      <h4 className="text-lg font-semibold mt-8">Gráficos adicionales de Altas</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div onClick={() => setModalSucursalAltas(true)}>
          <GraficoSucursal datos={altasNormalizadas} id="GraficoSucursalAltas" />
        </div>
        <div onClick={() => setModalEjecutivoAltas(true)}>
          <GraficoEjecutivo datos={altasNormalizadas} id="GraficoEjecutivoAltas" />
        </div>
        <div onClick={() => setModalTipoOTAltas(true)}>
          <GraficoTipoOT datos={altasNormalizadas} id="GraficoTipoOTAltas" />
        </div>
        <div onClick={() => setModalMesSucursalAltas(true)}>
          <GraficoMesSucursal datos={altasNormalizadas} id="GraficoMesSucursalAltas" />
        </div>
      </div>

      {/* BAJAS - Otros gráficos */}
      <h4 className="text-lg font-semibold mt-8">Gráficos adicionales de Bajas</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div onClick={() => setModalSucursalBajas(true)}>
          <GraficoSucursal datos={bajasNormalizadas} id="GraficoSucursalBajas" />
        </div>
        <div onClick={() => setModalEjecutivoBajas(true)}>
          <GraficoEjecutivo datos={bajasNormalizadas} id="GraficoEjecutivoBajas" />
        </div>
        <div onClick={() => setModalTipoOTBajas(true)}>
          <GraficoTipoOT datos={bajasNormalizadas} id="GraficoTipoOTBajas" />
        </div>
        <div onClick={() => setModalMesSucursalBajas(true)}>
          <GraficoMesSucursal datos={bajasNormalizadas} id="GraficoMesSucursalBajas" />
        </div>
      </div>

      {/* Modales ALTAS */}
      <ModalGraficoLineaMesSucursal show={modalAltasLinea} onClose={() => setModalAltasLinea(false)} datos={altasNormalizadas} />
      <ModalTablaCruzadaMesSucursal show={modalAltasTabla} onClose={() => setModalAltasTabla(false)} datos={altasNormalizadas} titulo="Altas por Mes y Sucursal" />
      <ModalGraficoSucursal show={modalSucursalAltas} onClose={() => setModalSucursalAltas(false)} datos={altasNormalizadas} />
      <ModalGraficoEjecutivo show={modalEjecutivoAltas} onClose={() => setModalEjecutivoAltas(false)} datos={altasNormalizadas} />
      <ModalGraficoTipoOT show={modalTipoOTAltas} onClose={() => setModalTipoOTAltas(false)} datos={altasNormalizadas} />
      <ModalGraficoMesSucursal show={modalMesSucursalAltas} onClose={() => setModalMesSucursalAltas(false)} datos={altasNormalizadas} />

      {/* Modales BAJAS */}
      <ModalGraficoLineaMesSucursal show={modalBajasLinea} onClose={() => setModalBajasLinea(false)} datos={bajasNormalizadas} />
      <ModalTablaCruzadaMesSucursal show={modalBajasTabla} onClose={() => setModalBajasTabla(false)} datos={bajasNormalizadas} titulo="Bajas por Mes y Sucursal" />
      <ModalGraficoSucursal show={modalSucursalBajas} onClose={() => setModalSucursalBajas(false)} datos={bajasNormalizadas} />
      <ModalGraficoEjecutivo show={modalEjecutivoBajas} onClose={() => setModalEjecutivoBajas(false)} datos={bajasNormalizadas} />
      <ModalGraficoTipoOT show={modalTipoOTBajas} onClose={() => setModalTipoOTBajas(false)} datos={bajasNormalizadas} />
      <ModalGraficoMesSucursal show={modalMesSucursalBajas} onClose={() => setModalMesSucursalBajas(false)} datos={bajasNormalizadas} />
    </div>
  );
}
