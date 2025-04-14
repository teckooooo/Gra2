<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;


class UserController extends Controller
{
    public function index() {
        $usuarios = User::all();
        return Inertia::render('Usuarios/Index', compact('usuarios'));
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    
        // Asignar el rol
        $role = Role::findById($request->role_id);
        $user->assignRole($role);
    
        return redirect()->back()->with('success', 'Usuario creado con rol');
    }

    
    public function destroy(User $usuario) {
        $usuario->delete();
        return redirect()->route('usuarios.index');
    }
    
    public function updateRol(Request $request, User $usuario) {
        // Actualizar el rol del usuario
    }
    public function assignPermissions(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
            'permissions' => 'array|exists:permissions,name'
        ]);

        $user->syncRoles($request->role);
        $user->syncPermissions($request->permissions);

        return redirect()->back()->with('success', 'Permisos actualizados');
    }
    
    
}
