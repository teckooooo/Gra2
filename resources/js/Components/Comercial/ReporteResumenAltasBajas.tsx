import React, { useState } from 'react';
import GraficoSucursal from './GraficoSucursal';
import GraficoEjecutivo from './GraficoEjecutivo';
import GraficoTipoOT from './GraficoTipoOT';
import GraficoMesSucursal from './GraficoMesSucursal';
import TablaCruzadaMesSucursal from './TablaCruzadaMesSucursal';
import GraficoLineaMesSucursal from './GraficoLineaMesSucursal';
import ModalGraficoLineaMesSucursal from './ModalGraficoLineaMesSucursal';
import ModalTablaCruzadaMesSucursal from './ModalTablaCruzadaMesSucursal';

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
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="transform scale-90 origin-top-left cursor-pointer"
          onClick={() => setModalAltasLinea(true)}
        >
          <GraficoLineaMesSucursal datos={altasNormalizadas} />
        </div>
        <div
          className="transform scale-90 origin-top-left cursor-pointer"
          onClick={() => setModalAltasTabla(true)}
        >
          <TablaCruzadaMesSucursal datos={altasNormalizadas} titulo="Altas por Mes y Sucursal" />
        </div>
      </div>

      {/* BAJAS */}
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="transform scale-90 origin-top-left cursor-pointer"
          onClick={() => setModalBajasLinea(true)}
        >
          <GraficoLineaMesSucursal datos={bajasNormalizadas} />
        </div>
        <div
          className="transform scale-90 origin-top-left cursor-pointer"
          onClick={() => setModalBajasTabla(true)}
        >
          <TablaCruzadaMesSucursal datos={bajasNormalizadas} titulo="Bajas por Mes y Sucursal" />
        </div>
      </div>

      {/* Modales */}
      <ModalGraficoLineaMesSucursal
        show={modalAltasLinea}
        onClose={() => setModalAltasLinea(false)}
        datos={altasNormalizadas}
      />
      <ModalGraficoLineaMesSucursal
        show={modalBajasLinea}
        onClose={() => setModalBajasLinea(false)}
        datos={bajasNormalizadas}
      />
      <ModalTablaCruzadaMesSucursal
        show={modalAltasTabla}
        onClose={() => setModalAltasTabla(false)}
        datos={altasNormalizadas}
        titulo="Altas por Mes y Sucursal"
      />
      <ModalTablaCruzadaMesSucursal
        show={modalBajasTabla}
        onClose={() => setModalBajasTabla(false)}
        datos={bajasNormalizadas}
        titulo="Bajas por Mes y Sucursal"
      />
    </div>
  );
}
