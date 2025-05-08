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
        $datos = DB::table('sheet_altas')->get();
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

            $imagenesValidas = array_filter($imagenes, function ($img) {
                return isset($img['base64']) && str_starts_with($img['base64'], 'data:image');
            });

            if (!empty($tablas['TablaAltasRaw'])) {
                $tablas['TablaAltas'] = $this->generarResumenCruzado($tablas['TablaAltasRaw']);
            }

            if (!empty($tablas['TablaBajasRaw'])) {
                $tablas['TablaBajas'] = $this->generarResumenCruzado($tablas['TablaBajasRaw']);
            }

            Log::info('📤 Generando PDF Comercial...', [
                'total_imagenes' => count($imagenes),
                'imagenes_validas' => count($imagenesValidas),
                'tablas' => array_keys($tablas),
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

    private function generarResumenCruzado(array $datos)
    {
        $mesesOrden = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        $datosFiltrados = array_filter($datos, fn($d) => !empty($d['mes']) && !empty($d['sucursal']));
        $sucursales = collect($datosFiltrados)->pluck('sucursal')->unique()->values()->all();

        $agrupado = [];
        foreach ($datosFiltrados as $item) {
            $mes = strtolower($item['mes']);
            $sucursal = $item['sucursal'];
            $agrupado[$mes][$sucursal] = ($agrupado[$mes][$sucursal] ?? 0) + 1;
        }

        $resumen = [];
        foreach ($mesesOrden as $mes) {
            if (isset($agrupado[$mes])) {
                $fila = ['mes' => $mes, 'valores' => [], 'total' => 0];
                foreach ($sucursales as $sucursal) {
                    $valor = $agrupado[$mes][$sucursal] ?? 0;
                    $fila['valores'][$sucursal] = $valor;
                    $fila['total'] += $valor;
                }
                $resumen[] = $fila;
            }
        }

        return $resumen;
    }
}
