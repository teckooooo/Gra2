<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportesCableColorController extends Controller
{
    public function obtenerDatos(Request $request, $zona)
    {
        $zonasMap = [
            'combarbala' => 'sheet_combarbala',
            'monte_patria' => 'sheet_monte_patria',
            'ovalle' => 'sheet_ovalle',
            'salamanca' => 'sheet_salamanca',
            'vicuna' => 'sheet_vicuna',
        ];

        if (!array_key_exists($zona, $zonasMap)) {
            abort(404, "Zona no encontrada");
        }

        $tabla = $zonasMap[$zona];
        $datos = DB::table($tabla)->get();

        $seguimiento = $this->generarSeguimientoDiario($datos);
        $topCanales = $this->generarTopCanales($datos);
        $jornada = $this->generarJornadaAMPM($datos);
        $incidencias = $this->generarTablaIncidencias($datos);
        $ultimoDia = $this->generarTablaUltimoDia($datos);

        return Inertia::render('reportesCanal', [
            'datosReporte' => [
                'seguimiento' => $seguimiento,
                'topCanales' => $topCanales,
                'jornada' => $jornada,
                'incidencias' => $incidencias,
                'ultimoDia' => $ultimoDia,
            ],
        ]);
    }

    private function generarSeguimientoDiario($datos)
    {
        $fechas = [];
        $conteoIncidencias = [];

        foreach ($datos as $fila) {
            $fecha = $fila->fecha;
            $incidencia = $fila->incidencia;

            $fechas[$fecha] = true;
            $conteoIncidencias[$incidencia][$fecha] = ($conteoIncidencias[$incidencia][$fecha] ?? 0) + 1;
        }

        $labels = array_keys($fechas);
        $datasets = [];

        foreach ($conteoIncidencias as $incidencia => $frecuencias) {
            $datasets[] = [
                'label' => $incidencia,
                'data' => array_map(fn($fecha) => $frecuencias[$fecha] ?? 0, $labels),
                'backgroundColor' => $this->colorIncidencia($incidencia),
            ];
        }

        return [
            'data' => [
                'labels' => $labels,
                'datasets' => $datasets,
            ],
            'options' => ['responsive' => true],
        ];
    }

    private function generarTopCanales($datos)
    {
        $conteoCanales = [];

        foreach ($datos as $fila) {
            $canal = $fila->canal;
            $conteoCanales[$canal] = ($conteoCanales[$canal] ?? 0) + 1;
        }

        arsort($conteoCanales);
        $top10 = array_slice($conteoCanales, 0, 10, true);

        return [
            'data' => [
                'labels' => array_keys($top10),
                'datasets' => [
                    [
                        'label' => 'Fallas',
                        'data' => array_values($top10),
                        'backgroundColor' => '#7e22ce',
                    ],
                ],
            ],
            'options' => ['indexAxis' => 'y', 'responsive' => true],
        ];
    }

    private function generarJornadaAMPM($datos)
    {
        $fechas = [];
        $conteoAM = [];
        $conteoPM = [];

        foreach ($datos as $fila) {
            $fecha = $fila->fecha;
            $jornada = strtoupper($fila->jornada ?? 'AM');

            $fechas[$fecha] = true;
            if ($jornada == 'AM') {
                $conteoAM[$fecha] = ($conteoAM[$fecha] ?? 0) + 1;
            } else {
                $conteoPM[$fecha] = ($conteoPM[$fecha] ?? 0) + 1;
            }
        }

        $labels = array_keys($fechas);

        return [
            'data' => [
                'labels' => $labels,
                'datasets' => [
                    [
                        'label' => 'AM',
                        'data' => array_map(fn($fecha) => $conteoAM[$fecha] ?? 0, $labels),
                        'backgroundColor' => '#60a5fa',
                    ],
                    [
                        'label' => 'PM',
                        'data' => array_map(fn($fecha) => $conteoPM[$fecha] ?? 0, $labels),
                        'backgroundColor' => '#2563eb',
                    ],
                ],
            ],
            'options' => ['responsive' => true],
        ];
    }

    private function generarTablaIncidencias($datos)
    {
        $conteo = [];

        foreach ($datos as $fila) {
            $incidencia = $fila->incidencia;
            $conteo[$incidencia] = ($conteo[$incidencia] ?? 0) + 1;
        }

        $total = array_sum($conteo);
        $tabla = [];

        foreach ($conteo as $incidencia => $cantidad) {
            $tabla[] = [
                'nombre' => $incidencia,
                'cantidad' => $cantidad,
                'porcentaje' => number_format(($cantidad / $total) * 100, 2) . '%',
            ];
        }

        return $tabla;
    }

    private function generarTablaUltimoDia($datos)
    {
        $ultimos = collect($datos)->sortByDesc('fecha')->take(10);

        return $ultimos->map(fn($fila) => [
            'canal' => $fila->canal,
            'fecha' => $fila->fecha,
            'incidencia' => $fila->incidencia,
        ])->values();
    }

    private function colorIncidencia($incidencia)
    {
        $colores = [
            'Sin señal' => '#ef4444',
            'Pixeleo' => '#ec4899',
            'Desfasado' => '#7e22ce',
            'Sin audio' => '#facc15',
            'Audio entrecortado' => '#60a5fa',
        ];

        return $colores[$incidencia] ?? '#64748b';
    }
}
