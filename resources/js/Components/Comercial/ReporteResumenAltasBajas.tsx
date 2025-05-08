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

export default function ReporteResumenAltasBajas({
  altas = [],
  bajas = [],
  modoExportar = false,
}: {
  altas: any[];
  bajas: any[];
  modoExportar?: boolean;
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

      {/* ALTAS */}
      <GraficoLineaMesSucursal datos={altasNormalizadas} id="GraficoLineaAltas" />
      <GraficoSucursal datos={altasNormalizadas} id="GraficoSucursalAltas" />
      <GraficoEjecutivo datos={altasNormalizadas} id="GraficoEjecutivoAltas" limitarTop10={modoExportar} />
      <GraficoTipoOT datos={altasNormalizadas} id="GraficoTipoOTAltas" />
      <GraficoMesSucursal datos={altasNormalizadas} id="GraficoMesSucursalAltas" />
      <TablaCruzadaMesSucursal datos={altasNormalizadas} titulo="Resumen Altas por Mes y Sucursal" id="TablaAltas" />

      {/* BAJAS */}
      <GraficoLineaMesSucursal datos={bajasNormalizadas} id="GraficoLineaBajas" />
      <GraficoSucursal datos={bajasNormalizadas} id="GraficoSucursalBajas" />
      <GraficoEjecutivo datos={bajasNormalizadas} id="GraficoEjecutivoBajas" limitarTop10={modoExportar} />
      <GraficoTipoOT datos={bajasNormalizadas} id="GraficoTipoOTBajas" />
      <GraficoMesSucursal datos={bajasNormalizadas} id="GraficoMesSucursalBajas" />
      <TablaCruzadaMesSucursal datos={bajasNormalizadas} titulo="Resumen Bajas por Mes y Sucursal" id="TablaBajas" />
    </div>
  );
}
