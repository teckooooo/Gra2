<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReporteCorreoController extends Controller
{
    public function index()
{
    $user = auth()->user();

    $horas = DB::table('config_reporte_horas')
        ->where('user_id', $user->id)
        ->select('id', 'hora')
        ->get(); // ⬅️ devuelve [{id, hora}]

    return Inertia::render('Configuracion', [
        'auth' => $user,
        'horas' => $horas,
    ]);
}

public function store(Request $request)
{
    $user = auth()->user();

    $request->validate([
        'hora' => ['required', 'regex:/^([01]\\d|2[0-3]):([0-5]\\d)$/'],
    ]);

    DB::table('config_reporte_horas')->insert([
        'user_id' => $user->id,
        'hora' => $request->hora,
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

    DB::table('config_reporte_horas')->where('id', $id)->update([
        'hora' => $request->hora,
        'updated_at' => now(),
    ]);

    return redirect()->back();
}

public function destroy($id)
{
    DB::table('config_reporte_horas')->where('id', $id)->delete();

    return redirect()->back();
}

}
