<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ComercialController extends Controller
{
    public function index($tipo)
    {
        if ($tipo === 'altas') {
            $registros = DB::table('sheet_altas')->get();
        } elseif ($tipo === 'bajas') {
            $registros = DB::table('sheet_bajas_2024')->get();
        } else {
            abort(404);
        }

        return Inertia::render('Comercial', [
            'tipo' => $tipo,
            'registros' => $registros,
        ]);
    }
}
