<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
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
        $imagenes = $request->input('imagenes', []);
        $tablas = $request->input('tablas', []);
    
        $fecha = now()->format('d/m/Y');
    
        $pdf = Pdf::loadView('reportes.comercial.pdf', [
            'imagenes' => $imagenes,
            'tablas' => $tablas,
            'fecha' => $fecha,
        ])->setPaper('a4', 'portrait');
    
        return $pdf->download('reporte_comercial.pdf');
    }

}
