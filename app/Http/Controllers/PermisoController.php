<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermisoController extends Controller
{
    public function index()
    {
        return Permission::all();
    }

    public function getPermisosPorRol($id)
    {
        $role = Role::findOrFail($id);
        return $role->permissions;
    }

    public function asignarPermisos(Request $request, $id)
{
    $request->validate([
        'permissions' => 'required|array',
        'permissions.*' => 'integer|exists:permissions,id',
    ]);

    $role = Role::findOrFail($id);
    $role->syncPermissions($request->permissions);

    return response()->json(['message' => 'Permisos asignados correctamente']);
}
}
