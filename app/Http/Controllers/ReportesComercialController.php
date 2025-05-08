<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ReportesComercialController extends Controller
{
    public function altas()
    {
        $datos = DB::table('sheet_altas')->get(); // o hacer agrupaciones aquí si prefieres

        return Inertia::render('reportesComercial', [
            'tipo' => 'Altas',
            'datos' => $datos
        ]);
    } 

    public function bajas()
    {
        $datos = DB::table('sheet_bajas_2024')->get();

        return Inertia::render('reportesComercial', [
            'tipo' => 'Bajas',
            'datos' => $datos
        ]);
    }

    public function resumen()
    {
        $altas = DB::table('sheet_altas')->get();
        $bajas = DB::table('sheet_bajas_2024')->get();

        return Inertia::render('reportesComercial', [
            'tipo' => 'Resumen Altas y Bajas',
            'altas' => $altas,
            'bajas' => $bajas
        ]);
    }

    public function exportarPDF(Request $request)
{
    try {
        $imagenes = $request->input('imagenes', []);
        $tablas = $request->input('tablas', []);
        $fecha = now()->format('d/m/Y');

        // Filtrar solo imágenes válidas (base64 completas)
        $imagenesValidas = array_filter($imagenes, function ($img) {
            return isset($img['base64']) && str_starts_with($img['base64'], 'data:image');
        });

        Log::info('📤 Generando PDF Comercial...', [
            'total_imagenes' => count($imagenes),
            'imagenes_validas' => count($imagenesValidas),
            'fecha' => $fecha,
        ]);

        $pdf = Pdf::loadView('reportes.comercial.pdf', [
            'imagenes' => $imagenesValidas,
            'tablas' => $tablas,
            'fecha' => $fecha,
        ])->setPaper('a4', 'portrait');

        Log::info('✅ PDF generado correctamente.');
        return $pdf->download('reporte_comercial.pdf');

    } catch (\Exception $e) {
        Log::error('❌ Error al generar PDF:', [
            'mensaje' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json(['error' => 'Error interno al generar el PDF.'], 500);
    }
}

}
