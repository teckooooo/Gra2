<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrillaCanalesController extends Controller
{
    public function show($zona)
    {
        $tabla = 'sheet_' . strtolower(str_replace(' ', '_', $zona));

        $tablasValidas = [
            'sheet_combarbala',
            'sheet_monte_patria',
            'sheet_ovalle',
            'sheet_ptn',
            'sheet_puq',
            'sheet_salamanca',
            'sheet_vicuna',
        ];

        if (!in_array($tabla, $tablasValidas)) {
            abort(404, 'Zona no válida.');
        }

        // Excluir columnas innecesarias
        $columnas = array_filter(
            DB::getSchemaBuilder()->getColumnListing($tabla),
            fn($col) => !in_array($col, ['created_at', 'updated_at'])
        );

        // Obtener filas no nulas ordenadas por fecha y luego por ID
        $datos = DB::table($tabla)
            ->select($columnas)
            ->whereNotNull('fecha')
            ->orderByRaw("STR_TO_DATE(fecha, '%d/%m/%Y') DESC")
            ->orderByDesc('id')
            ->get()
            ->filter(function ($item) {
                // ✅ Al menos un campo debe contener datos no nulos
                return collect($item)->filter(fn($val) => !is_null($val) && trim((string)$val) !== '')->isNotEmpty();
            })
            ->values();

        return Inertia::render('Dashboard', [
            'zona' => strtolower($zona),
            'datos' => $datos,
        ]);
    }
    
    public function update(Request $request, $zona, $id)
{
    $tabla = 'sheet_' . strtolower(str_replace(' ', '_', $zona));

    $tablasValidas = [
        'sheet_combarbala',
        'sheet_monte_patria',
        'sheet_ovalle',
        'sheet_ptn',
        'sheet_puq',
        'sheet_salamanca',
        'sheet_vicuna',
    ];

    if (!in_array($tabla, $tablasValidas)) {
        abort(404, 'Zona no válida.');
    }

    $columnas = array_filter(
        DB::getSchemaBuilder()->getColumnListing($tabla),
        fn($col) => !in_array($col, ['created_at', 'updated_at','id'])
    );

    $datos = $request->only($columnas);

    DB::table($tabla)->where('id', $id)->update($datos);

    return back()->with('success', 'Registro actualizado correctamente.');
}


}
