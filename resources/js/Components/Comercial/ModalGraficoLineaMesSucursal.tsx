import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any[];
}

export default function ModalGraficoLineaMesSucursal({ show, onClose, datos }: Props) {
  const colores: Record<string, string> = {
    'Ovalle': '#3b82f6',
    'XII Región': '#1e1b4b',
    'Vicuña': '#f97316',
    'Monte Patria': '#7c3aed',
    'Salamanca': '#ec4899',
    'Combarbalá': '#6b7280',
    'Illapel': '#10b981',
    'Sin dato': '#999999'
  };

  const mesesOrden = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const datosLimpios = datos.filter(d => d.mes && d.sucursal);

  const grouped: Record<string, Record<string, number>> = {};
  datosLimpios.forEach(({ mes, sucursal }) => {
    const mesLimpio = mes.toLowerCase();
    grouped[mesLimpio] = grouped[mesLimpio] || {};
    grouped[mesLimpio][sucursal] = (grouped[mesLimpio][sucursal] || 0) + 1;
  });

  const meses = mesesOrden.filter(m => Object.keys(grouped).includes(m));
  const sucursales = [...new Set(datosLimpios.map(d => d.sucursal))];

  const datasets = sucursales.map(sucursal => ({
    label: sucursal,
    borderColor: colores[sucursal] || '#000',
    backgroundColor: colores[sucursal] || '#000',
    data: meses.map(mes => grouped[mes]?.[sucursal] || 0),
    tension: 0.2,
    fill: false
  }));

  const data = {
    labels: meses.map(m => m[0].toUpperCase() + m.slice(1)),
    datasets
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">Suma de Cantidad por Mes y Sucursal</h3>
            <div style={{ height: '500px' }}>
              <Line data={data} options={{ responsive: true }} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
