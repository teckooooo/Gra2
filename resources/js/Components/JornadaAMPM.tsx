import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Props {
  show: boolean;
  onClose: () => void;
  datos: any;
  id?: string;
  zonaId?: string;
}

export default function JornadaAMPM({ show, onClose, datos, id = 'JornadaAMPM-general' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!datos || !datos.data || !datos.options || !canvasRef.current) return;

    // Destruir gráfico anterior si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const opcionesConEtiquetas = {
      ...datos.options,
      plugins: {
        ...datos.options.plugins,
        datalabels: {
          anchor: 'center',
          align: 'center',
          color: '#fff',
          font: {
            weight: 'bold' as const,
            size: show ? 18 : 12,
          },
          formatter: (value: number) => (value === 0 ? null : value),
        },
        legend: {
          position: 'top' as const,
          labels: {
            font: {
              size: show ? 16 : 12,
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#111',
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: show ? 14 : 10,
            },
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: '#111',
            font: {
              size: show ? 14 : 10,
            },
          },
        },
      },
    };

    chartInstanceRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: datos.data,
      options: opcionesConEtiquetas,
    });

    // Establecer ID para exportación
    canvasRef.current.id = id;
  }, [datos, id, show]);

  useEffect(() => {
    if (show) {
      window.scrollTo({ top: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!datos || !datos.data || !datos.options) {
    return <div className="text-sm text-gray-500 italic">No hay datos disponibles para Jornada AM/PM.</div>;
  }

  const canvas = (
    <>
      <h3 className="text-lg font-semibold mb-4">Jornada AM / PM</h3>
      <canvas ref={canvasRef} id={id} style={{ height: show ? '500px' : '300px', width: '100%' }}></canvas>
    </>
  );

  if (!show) {
    return (
      <div id={id} className="w-full h-full">
        {canvas}
      </div>
    );
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-6xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
            {canvas}
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
