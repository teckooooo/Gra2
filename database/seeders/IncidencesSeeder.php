<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncidencesSeeder extends Seeder
{
    public function run()
    {
        $incidencias = [
            'Audio en ingles',
            'Audio entrecortado',
            'Congelado',
            'Desfasado',
            'Entrecortado',
            'Imagen opaca',
            'Imagen pegada',
            'Interferencia',
            'Otro canal en reemplazo',
            'Pixeleo',
            'Se pausa continuamente',
            'Sin audio',
            'Sin incidencia',
            'Sin señal',
            'Sin señal/Con audio',
            'Sin señal/Sin audio',
        ];

        foreach ($incidencias as $incidencia) {
            DB::table('incidence')->updateOrInsert(
                ['nombre' => $incidencia],
                ['nombre' => $incidencia]
            );
        }
    }
}
