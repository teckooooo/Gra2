<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReporteCorreoController extends Controller
{
public function index()
{
    $horas = DB::table('config_reporte_horas')
        ->select('id', 'hora')
        ->get();

    return Inertia::render('Configuracion', [
        'horas' => $horas,
    ]);
}

public function store(Request $request)
{
    $request->validate([
        'hora' => ['required', 'regex:/^([01]\\d|2[0-3]):([0-5]\\d)$/'],
    ]);

    $existe = DB::table('config_reporte_horas')
        ->where('hora', $request->hora)
        ->exists();

if ($existe) {
    return redirect()->back()->withErrors([
        'hora' => 'La hora ya existe en la base de datos.'
    ]);
}



    DB::table('config_reporte_horas')->insert([
        'hora' => $request->hora,
        'user_id' => Auth::id(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return redirect()->back();
}


public function update(Request $request, $id)
{
    $request->validate([
        'hora' => ['required', 'regex:/^([01]\\d|2[0-3]):([0-5]\\d)$/'],
    ]);

    // Verifica duplicado
    $existe = DB::table('config_reporte_horas')
        ->where('hora', $request->hora)
        ->where('id', '!=', $id)
        ->exists();

if ($existe) {
    return redirect()->back()->withErrors([
        'hora' => 'La hora ya existe en la base de datos.'
    ]);
}


    DB::table('config_reporte_horas')->where('id', $id)->update([
        'hora' => $request->hora,
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Hora actualizada correctamente']);
}



public function destroy($id)
{
    DB::table('config_reporte_horas')->where('id', $id)->delete();

    return redirect()->back();
}

}
