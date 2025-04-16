import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import AsignarPermisos from './AsignarPermisos';
import CrearUsuario from './CrearUsuario';
import BaseDeDatos from './BaseDeDatos'; // ⚠️ Asegúrate de crear este componente

const Configuracion = () => {
  const { auth } = usePage().props;
  const [vista, setVista] = useState<'roles' | 'usuarios' | 'bd'>('roles');

  return (
    <AuthenticatedLayout>
      <div className="flex">
        {/* Menú lateral */}
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <h2 className="text-lg font-bold mb-4">Configuraciones</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setVista('roles')}
                className={`w-full text-left px-4 py-2 rounded ${
                  vista === 'roles' ? 'bg-blue-100 font-bold' : ''
                }`}
              >
                Roles
              </button>
            </li>
            <li>
              <button
                onClick={() => setVista('usuarios')}
                className={`w-full text-left px-4 py-2 rounded ${
                  vista === 'usuarios' ? 'bg-blue-100 font-bold' : ''
                }`}
              >
                Gestor de Usuarios
              </button>
            </li>
            <li>
              <button
                onClick={() => setVista('bd')}
                className={`w-full text-left px-4 py-2 rounded ${
                  vista === 'bd' ? 'bg-blue-100 font-bold' : ''
                }`}
              >
                Base de Datos
              </button>
            </li>
          </ul>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Configuraciones</h1>

          {vista === 'roles' && <AsignarPermisos />}
          {vista === 'usuarios' && <CrearUsuario />}
          {vista === 'bd' && <BaseDeDatos />}
        </main>
      </div>
    </AuthenticatedLayout>
  );
};

export default Configuracion;
