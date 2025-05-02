<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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
    
        // 🔁 Clonar para obtener todos los datos para gráficos
        $todosLosDatos = DB::table($tabla)->get();
    
        // 🔧 Transformar fechas en ambos casos (solo en $registros paginados)
        $registros->getCollection()->transform(function ($item) use ($tipo) {
            $campoFecha = $tipo === 'altas' ? 'periodo' : 'fecha_de_termino';
    
            if (is_numeric($item->$campoFecha)) {
                $item->$campoFecha = Carbon::createFromDate(1900, 1, 1)
                    ->addDays($item->$campoFecha - 2)
                    ->format('d/m/Y');
            } elseif (is_string($item->$campoFecha) && preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $item->$campoFecha)) {
                // ya está bien
            } else {
                $item->$campoFecha = '-';
            }
    
            return $item;
        });
    
        return Inertia::render('Comercial', [
            'tipo' => $tipo,
            'registros' => $registros,
            'datos' => $todosLosDatos, // ✅ para los gráficos
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

}
