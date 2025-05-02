<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
}
