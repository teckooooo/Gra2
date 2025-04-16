import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

export default function BaseDeDatos() {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!archivo) return alert('Selecciona un archivo');

        const formData = new FormData();
        formData.append('file', archivo);

        try {
            setCargando(true);
            await axios.post('/importar-excel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Archivo importado correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al importar archivo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow max-w-xl mx-auto mt-10">
            <Head title="Base de Datos" />
            <h2 className="text-2xl font-bold mb-4">Importar archivo Excel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                    className="w-full border p-2"
                />
                <button
                    type="submit"
                    disabled={cargando}
                    className={`w-full px-4 py-2 rounded text-white ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {cargando ? 'Importando...' : 'Subir archivo'}
                </button>
            </form>
        </div>
    );
}
