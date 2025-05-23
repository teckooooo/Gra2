<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Ejecutivo;

class ComercialController extends Controller
{

public function index($tipo, Request $request)
{
    if (!in_array($tipo, ['altas', 'bajas'])) {
        abort(404);
    }

    $tabla = $tipo === 'altas' ? 'sheet_altas' : 'sheet_bajas_2024';
    $perPage = $request->input('perPage', 50);

    $query = DB::table($tabla);

    $tipo === 'altas'
        ? $query->orderByRaw("STR_TO_DATE(periodo, '%d/%m/%Y') DESC")
        : $query->orderByRaw("STR_TO_DATE(fecha_de_termino, '%d/%m/%Y') DESC");

    $registros = $query->paginate($perPage)->withQueryString();

    // ✅ Ejecutivos activos desde la tabla oficial
    $ejecutivos = Ejecutivo::where('activo', 1)->pluck('nombre');

    $tiposOT = DB::table('sheet_altas')->select('tipo_ot')->distinct()->pluck('tipo_ot');
    $sucursales = DB::table('sheet_altas')->select('sucursal')->distinct()->pluck('sucursal');
    $planes = DB::table('planes')->select('nombre')->distinct()->pluck('nombre');

    // ...
    return Inertia::render('Comercial', [
        'tipo' => $tipo,
        'registros' => $registros,
        'datos' => DB::table($tabla)->get(),
        'ejecutivos' => $ejecutivos,
        'tiposOT' => $tiposOT,
        'sucursales' => $sucursales,
        'planes' => $planes,
    ]);
}

    

    public function store(Request $request, $tipo)
    {
        if (!in_array($tipo, ['altas', 'bajas'])) {
            abort(404);
        }

        $tabla = $tipo === 'altas' ? 'sheet_altas' : 'sheet_bajas_2024';

        $rules = $tipo === 'altas' ? [
            'ejecutivo' => 'required|string',
            'tipo_ot' => 'required|string',
            'cantidad' => 'required|integer',
            'sucursal' => 'required|string',
            'periodo' => 'required|date_format:d/m/Y',
        ] : [
            'comuna' => 'required|string',
            'cliente' => 'required|string',
            'fecha_de_termino' => 'required|date_format:d/m/Y',
            'nombre' => 'required|string',
            'direccion' => 'required|string',
            'plan' => 'required|string',
            'valor' => 'required|numeric',
            'telefono1' => 'nullable|string',
            'telefono2' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        DB::table($tabla)->insert($validated);

        return redirect()->route('comercial.vista', ['tipo' => $tipo]);
    }

    public function update(Request $request, $tipo, $id)
    {
        if (!in_array($tipo, ['altas', 'bajas'])) {
            abort(404);
        }

        $tabla = $tipo === 'altas' ? 'sheet_altas' : 'sheet_bajas_2024';

        $columnas = array_filter(
            DB::getSchemaBuilder()->getColumnListing($tabla),
            fn($col) => !in_array($col, ['created_at', 'updated_at'])
        );

        $data = $request->only($columnas);

        DB::table($tabla)->where('id', $id)->update($data);

        return back()->with('success', 'Registro actualizado correctamente.');
    }

    public function destroy($tipo, $id)
    {
        if (!in_array($tipo, ['altas', 'bajas'])) {
            abort(404);
        }

        $tabla = $tipo === 'altas' ? 'sheet_altas' : 'sheet_bajas_2024';

        DB::table($tabla)->where('id', $id)->delete();

        return back()->with('success', 'Registro eliminado correctamente.');
    }

}
