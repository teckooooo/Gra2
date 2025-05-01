// ✅ AgregarRegistroComercialAltaModal.tsx
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface AgregarRegistroModalProps {
    tipo: 'altas' | 'bajas';
    isOpen: boolean;
    onClose: () => void;
}

export default function AgregarRegistroComercialAltaModal({ tipo, isOpen, onClose }: AgregarRegistroModalProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});

    const camposAltas = ['ejecutivo', 'tipo_ot', 'cantidad', 'sucursal', 'periodo'];
    const camposBajas = ['comuna', 'cliente', 'fecha_de_termino', 'nombre', 'direccion', 'plan', 'valor', 'telefono1', 'telefono2'];

    const campos = tipo === 'altas' ? camposAltas : camposBajas;

    const handleChange = (campo: string, valor: string) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('comercial.store', { tipo }), formData, {
            onSuccess: () => {
                setFormData({});
                onClose();
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
                            <label className="block font-medium text-sm text-gray-700 capitalize">{campo.replace(/_/g, ' ')}</label>
                            <input
                                type="text"
                                value={formData[campo] || ''}
                                onChange={(e) => handleChange(campo, e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
