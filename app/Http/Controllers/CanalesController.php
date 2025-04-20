<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CanalesController extends Controller
{
    public function index()
    {
        $datos = DB::table('sheet_canales')
            ->select('id', 'canal', 'canales_con_decodificador')
            ->get()
            ->filter(function ($item) {
                return !empty($item->canal) || !empty($item->canales_con_decodificador);
            })
            ->values();

        return Inertia::render('Canales', [
            'auth' => [
                'user' => array_merge([
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ], [
                    'permissions' => Auth::user()->permissions ?? [],
                ]),
            ],
            'datos' => $datos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:normal,decodificador',
        ]);

        // Inserta en la primera fila vacía si existe
        $columna = $request->tipo === 'normal' ? 'canal' : 'canales_con_decodificador';
        $registro = DB::table('sheet_canales')
            ->whereNull($columna)
            ->orderBy('id')
            ->first();

        if ($registro) {
            DB::table('sheet_canales')
                ->where('id', $registro->id)
                ->update([$columna => $request->nombre]);
        } else {
            // Si no hay espacio, inserta como nueva fila
            DB::table('sheet_canales')->insert([
                'canal' => $request->tipo === 'normal' ? $request->nombre : null,
                'canales_con_decodificador' => $request->tipo === 'decodificador' ? $request->nombre : null,
            ]);
        }

        return redirect()->back()->with('success', 'Canal agregado correctamente.');
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:normal,decodificador',
        ]);
    
        $columna = $request->tipo === 'normal' ? 'canal' : 'canales_con_decodificador';
        $columnaOpuesta = $request->tipo === 'normal' ? 'canales_con_decodificador' : 'canal';
    
        DB::table('sheet_canales')->where('id', $id)->update([
            $columna => $request->nombre,     // ✅ actualiza el campo correcto
            $columnaOpuesta => null,          // ✅ limpia el campo contrario
        ]);
    
        return redirect()->back()->with('success', 'Canal actualizado correctamente.');
    }
    


    public function destroy($id)
    {
        DB::table('sheet_canales')->where('id', $id)->update([
            'canal' => null,
            'canales_con_decodificador' => null,
        ]);

        return redirect()->back()->with('success', 'Canal eliminado correctamente.');
    }
}
