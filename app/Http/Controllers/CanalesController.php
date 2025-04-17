<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        ->values(); // reindexa los resultados (por si se eliminan índices)


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

}
