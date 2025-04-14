<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermisosBaseSeeder extends Seeder
{
    public function run()
    {
        $permisos = [
            'Acceso a Grilla Canal',
            'Acceso a Módulo Comercial',
            'Acceso a Reportes Canal',
            'Acceso a Reportes Comercial',
            'Acceso a Configuraciones',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }
    }
}
