<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index() {
        $usuarios = User::all();
        return Inertia::render('Usuarios/Index', compact('usuarios'));
    }
    
    public function store(Request $request) {
        // Validar y crear usuario
    }
    
    public function destroy(User $usuario) {
        $usuario->delete();
        return redirect()->route('usuarios.index');
    }
    
    public function updateRol(Request $request, User $usuario) {
        // Actualizar el rol del usuario
    }
    
}
