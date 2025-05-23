import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

interface Ejecutivo {
  id: number;
  nombre: string;
  activo: number;
}

const GestionEjecutivos = () => {
  const [ejecutivos, setEjecutivos] = useState<Ejecutivo[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');

  const fetchEjecutivos = () => {
    axios.get('/configuracion/ejecutivos')
      .then(res => setEjecutivos(res.data))
      .catch(err => console.error(err));
  };

  const agregarEjecutivo = () => {
    if (!nuevoNombre.trim()) return;
    axios.post('/configuracion/ejecutivos', { nombre: nuevoNombre })
      .then(() => {
        setNuevoNombre('');
        fetchEjecutivos();
      });
  };

  const eliminarEjecutivo = (id: number) => {
    axios.delete(`/configuracion/ejecutivos/${id}`).then(fetchEjecutivos);
  };

  const toggleActivo = (id: number) => {
    axios.patch(`/configuracion/ejecutivos/${id}/toggle`).then(fetchEjecutivos);
  };

  const iniciarEdicion = (ejecutivo: Ejecutivo) => {
    setEditandoId(ejecutivo.id);
    setNombreEditado(ejecutivo.nombre);
  };

  const guardarNombre = (id: number) => {
    if (!nombreEditado.trim()) return;
    axios.put(`/configuracion/ejecutivos/${id}`, { nombre: nombreEditado })
      .then(() => {
        setEditandoId(null);
        fetchEjecutivos();
      });
  };

  useEffect(fetchEjecutivos, []);

  return (
    <div>
      
      <h2 className="text-xl font-bold mb-4">Gestión de Ejecutivos</h2>
      <Head title="Ejecutivos" />

      <div className="flex space-x-2 mb-4">
        
        <input
          className="border px-2 py-1"
          type="text"
          placeholder="Nombre del ejecutivo"
          value={nuevoNombre}
          onChange={e => setNuevoNombre(e.target.value)}
        />
        <button onClick={agregarEjecutivo} className="bg-green-500 text-white px-4 py-1 rounded">
          Agregar
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Activo</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ejecutivos.map(e => (
            <tr key={e.id}>
              <td className="border p-2">{e.id}</td>
              <td className="border p-2">
                {editandoId === e.id ? (
                  <input
                    type="text"
                    className="border px-2 py-1 w-full"
                    value={nombreEditado}
                    onChange={e => setNombreEditado(e.target.value)}
                  />
                ) : (
                  e.nombre
                )}
              </td>
              <td className="border p-2">{e.activo ? 'Sí' : 'No'}</td>
              <td className="border p-2 space-x-2">
                {editandoId === e.id ? (
                  <button onClick={() => guardarNombre(e.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Guardar</button>
                ) : (
                  <button onClick={() => iniciarEdicion(e)} className="bg-blue-300 px-2 py-1 rounded">Editar</button>
                )}
                <button onClick={() => toggleActivo(e.id)} className="bg-yellow-400 px-2 py-1 rounded">Activar/Desactivar</button>
                <button onClick={() => eliminarEjecutivo(e.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionEjecutivos;
