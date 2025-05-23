<?php

// app/Http/Controllers/EjecutivosController.php
namespace App\Http\Controllers;

use App\Models\Ejecutivo;
use Illuminate\Http\Request;

class EjecutivosController extends Controller
{
    public function index()
    {
        return Ejecutivo::all();
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required|string']);
        Ejecutivo::create(['nombre' => $request->nombre, 'activo' => true]);
        return response()->json(['message' => 'Ejecutivo creado']);
    }

    public function destroy($id)
    {
        Ejecutivo::destroy($id);
        return response()->json(['message' => 'Ejecutivo eliminado']);
    }

    public function toggleActivo($id)
    {
        $ejecutivo = Ejecutivo::findOrFail($id);
        $ejecutivo->activo = !$ejecutivo->activo;
        $ejecutivo->save();
        return response()->json(['message' => 'Estado actualizado']);
    }
    public function update(Request $request, $id)
{
    $request->validate(['nombre' => 'required|string']);
    $ejecutivo = Ejecutivo::findOrFail($id);
    $ejecutivo->nombre = $request->nombre;
    $ejecutivo->save();
    return response()->json(['message' => 'Nombre actualizado']);
}

}
