<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return \App\Models\Role::all();
    }

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|unique:roles,name',
    ]);

    $role = \Spatie\Permission\Models\Role::create([
        'name' => $request->name,
        'guard_name' => 'web' // importante si usas Spatie con múltiples guards
    ]);

    return response()->json($role); // para que el frontend lo reciba
}


    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->back();
    }
}
