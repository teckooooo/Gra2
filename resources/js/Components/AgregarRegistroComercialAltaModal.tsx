import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AgregarRegistroModalProps {
tipo: 'altas' | 'bajas';
isOpen: boolean;
onClose: () => void;
}

interface Errors {
[key: string]: string;
}

export default function AgregarRegistroComercialAltaModal({
tipo,
isOpen,
onClose,
}: AgregarRegistroModalProps) {
const [formData, setFormData] = useState<Record<string, string>>({});
const [fechaPeriodo, setFechaPeriodo] = useState<Date | null>(new Date());
const [errors, setErrors] = useState<Errors>({});

const { ejecutivos = [], tiposOT = [], sucursales = [], planes = [] } = usePage().props as any;

const camposAltas = ['ejecutivo', 'tipo_ot', 'cantidad', 'sucursal', 'periodo'];
const camposBajas = [
    'comuna',
    'cliente',
    'fecha_de_termino',
    'nombre',
    'direccion',
    'plan',
    'valor',
    'telefono1',
    'telefono2',
];

const campos = tipo === 'altas' ? camposAltas : camposBajas;

const handleChange = (campo: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
};

useEffect(() => {
    if (fechaPeriodo instanceof Date) {
    const formatter = new Intl.DateTimeFormat('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const parts = formatter.formatToParts(fechaPeriodo);
    const dia = parts.find((p) => p.type === 'day')?.value;
    const mes = parts.find((p) => p.type === 'month')?.value;
    const anio = parts.find((p) => p.type === 'year')?.value;

    if (dia && mes && anio) {
        const formatted = `${dia}/${mes}/${anio}`;
        const campoFecha = tipo === 'altas' ? 'periodo' : 'fecha_de_termino';
        setFormData((prev) => ({ ...prev, [campoFecha]: formatted }));
    }
    }
}, [fechaPeriodo]);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    router.post(route('comercial.store', { tipo }), formData, {
    onSuccess: () => {
        setFormData({});
        onClose();
        router.visit(route('comercial.vista', { tipo }), { preserveScroll: true });
    },
    onError: (err) => {
        setErrors(err);
        console.error('Errores del servidor:', err);
    },
    });
};

if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Agregar Registro ({tipo})</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        {campos.map((campo) => (
            <div key={campo}>
            <label className="block font-medium text-sm text-gray-700 capitalize">
                {campo.replace(/_/g, ' ')}
            </label>
            {campo === 'periodo' && tipo === 'altas' || campo === 'fecha_de_termino' && tipo === 'bajas' ? (
                <DatePicker
                selected={fechaPeriodo}
                onChange={(date) => setFechaPeriodo(date)}
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
            ) : ['ejecutivo', 'tipo_ot', 'sucursal', 'comuna', 'plan'].includes(campo) ? (
                <select
                value={formData[campo] || ''}
                onChange={(e) => handleChange(campo, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                >
                <option value="">Seleccione {campo.replace('_', ' ')}</option>
                {(campo === 'ejecutivo'
                    ? ejecutivos
                    : campo === 'tipo_ot'
                    ? tiposOT
                    : campo === 'sucursal' || campo === 'comuna'
                    ? sucursales
                    : planes
                ).map((opcion: string) => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                ))}
                </select>
            ) : (
                <input
                type="text"
                value={formData[campo] || ''}
                onChange={(e) => {
                    const valor = campo === 'cantidad' || campo === 'valor'
                    ? (parseInt(e.target.value) || '').toString()
                    : e.target.value;
                    handleChange(campo, valor);
                }}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
            )}
            {errors[campo] && (
                <p className="text-red-500 text-sm">{errors[campo]}</p>
            )}
            </div>
        ))}
        <div className="flex justify-end gap-2 pt-4">
            <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
            Cancelar
            </button>
            <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
            Guardar
            </button>
        </div>
        </form>
    </div>
    </div>
);
}