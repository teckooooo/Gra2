<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermisosBaseSeeder extends Seeder
{
    public function run()
    {
        // Crear permisos
        $permisos = [
            'Acceso a Grilla Canal',
            'Acceso a Módulo Comercial',
            'Acceso a Reportes Canal',
            'Acceso a Reportes Comercial',
            'Acceso a Configuraciones',
            'Acceso a Canales'
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }

        // Crear roles
        $admin = Role::firstOrCreate(['name' => 'Administrador']);
        $supervisor = Role::firstOrCreate(['name' => 'Supervisor']);
        $usuarioCanal = Role::firstOrCreate(['name' => 'UsuarioCanal']);
        $usuarioComercial = Role::firstOrCreate(['name' => 'UsuarioComercial']);

        // Asignar permisos a los roles
        $admin->syncPermissions($permisos);

        $supervisor->syncPermissions([
            'Acceso a Grilla Canal',
            'Acceso a Módulo Comercial',
            'Acceso a Reportes Canal',
            'Acceso a Reportes Comercial',
        ]);

        $usuarioCanal->syncPermissions([
            'Acceso a Grilla Canal',
        ]);

        $usuarioComercial->syncPermissions([
            'Acceso a Módulo Comercial',
        ]);
    }
}
