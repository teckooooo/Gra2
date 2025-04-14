<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;


class UserController extends Controller
{
    public function index() {
        $usuarios = User::all();
        return Inertia::render('Usuarios/Index', compact('usuarios'));
    }
    
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed|min:6',
        'role_id' => 'nullable|exists:roles,id',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'role_id' => $request->role_id,
    ]);

    return redirect()->route('usuarios.index');
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
