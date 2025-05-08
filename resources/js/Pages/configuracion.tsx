import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, router } from '@inertiajs/react';
import AsignarPermisos from './AsignarPermisos';
import CrearUsuario from './CrearUsuario';
import BaseDeDatos from './BaseDeDatos'; 
import ConfiguracionReportes from './ConfiguracionReportes';

interface HoraItem {
  id: number;
  hora: string;
}

interface PageProps {
  auth: any;
  horas: HoraItem[];
  [key: string]: any;
}

const Configuracion = () => {
  const { auth, horas } = usePage<PageProps>().props;
  const [vista, setVista] = useState<'roles' | 'usuarios' | 'bd' | 'cr'>('roles');

  // 🔄 Recargar las horas desde el backend al volver a "cr"
  useEffect(() => {
    if (vista === 'cr') {
      router.reload({ only: ['horas'] });
    }
  }, [vista]);

  return (
    <AuthenticatedLayout>
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <h2 className="text-lg font-bold mb-4">Configuraciones</h2>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setVista('roles')} className={`w-full text-left px-4 py-2 rounded ${vista === 'roles' ? 'bg-blue-100 font-bold' : ''}`}>Roles</button>
            </li>
            <li>
              <button onClick={() => setVista('usuarios')} className={`w-full text-left px-4 py-2 rounded ${vista === 'usuarios' ? 'bg-blue-100 font-bold' : ''}`}>Gestor de Usuarios</button>
            </li>
            <li>
              <button onClick={() => setVista('bd')} className={`w-full text-left px-4 py-2 rounded ${vista === 'bd' ? 'bg-blue-100 font-bold' : ''}`}>Base de Datos</button>
            </li>
            <li>
              <button onClick={() => setVista('cr')} className={`w-full text-left px-4 py-2 rounded ${vista === 'cr' ? 'bg-blue-100 font-bold' : ''}`}>Reportes</button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Configuraciones</h1>
          {vista === 'roles' && <AsignarPermisos />}
          {vista === 'usuarios' && <CrearUsuario />}
          {vista === 'bd' && <BaseDeDatos />}
          {vista === 'cr' && <ConfiguracionReportes auth={auth} horas={horas} />}
        </main>
      </div>
    </AuthenticatedLayout>
  );
};

export default Configuracion;
