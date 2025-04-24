import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

interface AddRecordModalProps {
    zona: string;
    zonas: string[];
    canales: string[];
    incidencias: string[];
    isOpen: boolean;
    onClose: () => void;
}

const AgregarRegistroModal: React.FC<AddRecordModalProps> = ({
    zona,
    zonas,
    canales,
    incidencias,
    isOpen,
    onClose,
}) => {
    const [fecha, setFecha] = useState<Date | null>(new Date());
    const [canal, setCanal] = useState<{ value: string; label: string } | null>(null);
    const [incidencia, setIncidencia] = useState<{ value: string; label: string } | null>(null);
    const [frecuencia, setFrecuencia] = useState('');
    const [jornada, setJornada] = useState('AM');
    const [comuna, setComuna] = useState(zona);

    const { data, setData, post, processing, errors, reset } = useForm({
        fecha: '',
        canal: '',
        incidencia: '',
        frecuencia: '',
        jornada: '',
        comuna: '',
    });

    useEffect(() => {
        if (fecha) {
            const formattedDate = fecha.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setData('fecha', formattedDate);
        }
    }, [fecha]);

    useEffect(() => {
        setData('canal', canal?.value || '');
    }, [canal]);

    useEffect(() => {
        setData('incidencia', incidencia?.value || '');
    }, [incidencia]);

    useEffect(() => {
        setData('frecuencia', frecuencia);
    }, [frecuencia]);

    useEffect(() => {
        setData('jornada', jornada);
    }, [jornada]);

    useEffect(() => {
        setData('comuna', comuna);
    }, [comuna]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('grilla.zona.store', zona), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                router.visit(route('grilla.zona', zona), { preserveScroll: true });
            },
        });
    };
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Registro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha</label>
                        <DatePicker
                            selected={fecha}
                            onChange={(date) => setFecha(date)}
                            dateFormat="dd/MM/yyyy"
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.fecha && <p className="text-red-500 text-sm">{errors.fecha}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Canal</label>
                        <Select
                            options={canales.map((c) => ({ value: c, label: c }))}
                            value={canal}
                            onChange={(selected) => setCanal(selected)}
                            className="mt-1"
                        />
                        {errors.canal && <p className="text-red-500 text-sm">{errors.canal}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Incidencia</label>
                        <Select
                            options={incidencias.map((i) => ({ value: i, label: i }))}
                            value={incidencia}
                            onChange={(selected) => setIncidencia(selected)}
                            className="mt-1"
                        />
                        {errors.incidencia && <p className="text-red-500 text-sm">{errors.incidencia}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                        <input
                            type="text"
                            value={frecuencia}
                            onChange={(e) => setFrecuencia(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.frecuencia && <p className="text-red-500 text-sm">{errors.frecuencia}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jornada</label>
                        <select
                            value={jornada}
                            onChange={(e) => setJornada(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                        {errors.jornada && <p className="text-red-500 text-sm">{errors.jornada}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comuna</label>
                        <select
                            value={comuna}
                            onChange={(e) => setComuna(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        >
                            {zonas.map((z) => (
                                <option key={z} value={z}>
                                    {z}
                                </option>
                            ))}
                        </select>
                        {errors.comuna && <p className="text-red-500 text-sm">{errors.comuna}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarRegistroModal;
