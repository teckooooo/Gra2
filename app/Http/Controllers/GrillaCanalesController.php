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
            'sheet_puerto_natales',
            'sheet_punta_arenas',
            'sheet_salamanca',
            'sheet_vicuna',
            'sheet_illapel',
        ];

        if (!in_array($tabla, $tablasValidas)) {
            abort(404, 'Zona no válida.');
        }

        $columnas = array_filter(
            DB::getSchemaBuilder()->getColumnListing($tabla),
            fn($col) => !in_array($col, ['created_at', 'updated_at'])
        );

        $perPage = request()->input('perPage', 50);

        $datosPaginados = DB::table($tabla)
            ->select($columnas)
            ->whereNotNull('fecha')
            ->orderByRaw("STR_TO_DATE(fecha, '%d/%m/%Y') DESC")
            ->paginate($perPage)
            ->withQueryString();

        $datosPaginados->getCollection()->transform(function ($item) {
            $item->fecha = str_replace('-', '/', $item->fecha);
            if (preg_match('/^\d{4}\/\d{2}\/\d{2}$/', $item->fecha)) {
                $partes = explode('/', $item->fecha);
                $item->fecha = "{$partes[2]}/{$partes[1]}/{$partes[0]}";
            }
            return $item;
        });

        $canales = DB::table('sheet_canales')
            ->select('canal')
            ->whereNotNull('canal')
            ->pluck('canal')
            ->merge(
                DB::table('sheet_canales')
                    ->select('canales_con_decodificador')
                    ->whereNotNull('canales_con_decodificador')
                    ->pluck('canales_con_decodificador')
            )
            ->unique()
            ->sort()
            ->values();

        $incidencias = DB::table('incidence')->pluck('nombre')->unique()->sort()->values();

        return Inertia::render('Dashboard', [
            'zona' => strtolower($zona),
            'datos' => $datosPaginados,
            'canales' => $canales,
            'incidencias' => $incidencias,
        ]);
    }


    public function update(Request $request, $zona, $id)
    {
        $tabla = 'sheet_' . strtolower(str_replace(' ', '_', $zona));

        $tablasValidas = [
            'sheet_combarbala',
            'sheet_monte_patria',
            'sheet_ovalle',
            'sheet_puerto_natales',
            'sheet_punta_arenas',
            'sheet_salamanca',
            'sheet_vicuna',
            'sheet_illapel',
        ];

        if (!in_array($tabla, $tablasValidas)) {
            abort(404, 'Zona no válida.');
        }

        $columnas = array_filter(
            DB::getSchemaBuilder()->getColumnListing($tabla),
            fn($col) => !in_array($col, ['created_at', 'updated_at'])
        );

        $datos = $request->only($columnas);

        DB::table($tabla)->where('id', $id)->update($datos);

        return back()->with('success', 'Registro actualizado correctamente.');
    }

    public function store(Request $request, $zona)
    {
        $tabla = 'sheet_' . strtolower(str_replace(' ', '_', $zona));

        $tablasValidas = [
            'sheet_combarbala',
            'sheet_monte_patria',
            'sheet_ovalle',
            'sheet_puerto_natales',
            'sheet_punta_arenas',
            'sheet_salamanca',
            'sheet_vicuna',
            'sheet_illapel',
        ];

        if (!in_array($tabla, $tablasValidas)) {
            abort(404, 'Zona no válida.');
        }

        // Validaciones base
        $rules = [
            'fecha' => 'required|date',
            'canal' => 'required|string',
            'incidencia' => 'required|string',
            'frecuencia' => 'nullable|string',
            'jornada' => 'required|in:AM,PM',
            'comuna' => 'required|string',
        ];

        // Solo validar 'formato' si la zona lo requiere
        if (in_array($tabla, ['sheet_puerto_natales', 'sheet_punta_arenas'])) {
            $rules['formato'] = 'required|string|in:DECO,Analoga';
        }

        $validated = $request->validate($rules);

        // Formatear fecha y comuna
        $fechaFormateada = date('d/m/Y', strtotime($validated['fecha']));
        $comunaCapitalizada = ucfirst(strtolower($validated['comuna']));

        // Armar datos a insertar
        $datos = [
            'fecha' => $fechaFormateada,
            'canal' => $validated['canal'],
            'incidencia' => $validated['incidencia'],
            'frecuencia' => $validated['frecuencia'],
            'jornada' => $validated['jornada'],
            'comuna' => $comunaCapitalizada,
        ];

        // Agregar formato solo si la tabla lo acepta
        if (in_array($tabla, ['sheet_puerto_natales', 'sheet_punta_arenas'])) {
            $datos['formato'] = $validated['formato'];
        }

        DB::table($tabla)->insert($datos);

        return redirect()->route('grilla.zona', strtolower($zona))->with('success', 'Registro creado correctamente.');
    }

    public function destroy($zona, $id)
    {
        $tabla = 'sheet_' . strtolower(str_replace(' ', '_', $zona));

        $tablasValidas = [
            'sheet_combarbala',
            'sheet_monte_patria',
            'sheet_ovalle',
            'sheet_puerto_natales',
            'sheet_punta_arenas',
            'sheet_salamanca',
            'sheet_vicuna',
            'sheet_illapel',
        ];

        if (!in_array($tabla, $tablasValidas)) {
            abort(404, 'Zona no válida.');
        }

        DB::table($tabla)->where('id', $id)->delete();

        return back()->with('success', 'Registro eliminado correctamente.');
    }

}
