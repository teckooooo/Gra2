<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportesCableColorController extends Controller
{
    private $coloresIncidencias = [];

    public function __construct()
    {
        $this->cargarColoresIncidencias();
    }

    public function obtenerDatos(Request $request, $zona)
    {
        $fechaInicio = $request->query('fecha_inicio');
        $fechaFin = $request->query('fecha_fin');

        return $this->generarDatosParaZona($zona, true, $fechaInicio, $fechaFin);
    }

    private function generarDatosParaZona($zona, $esVistaInertia = false, $fechaInicio = null, $fechaFin = null)
    {
        $zonasMap = [
            'combarbala' => 'sheet_combarbala',
            'monte_patria' => 'sheet_monte_patria',
            'ovalle' => 'sheet_ovalle',
            'salamanca' => 'sheet_salamanca',
            'vicuna' => 'sheet_vicuna',
            'puerto_natales' => 'sheet_puerto_natales',
            'punta_arenas' => 'sheet_punta_arenas',
            'illapel' => 'sheet_illapel',
        ];

        if (!array_key_exists($zona, $zonasMap)) {
            abort(404, "Zona no encontrada");
        }

        $tabla = $zonasMap[$zona];

        if ($fechaInicio && $fechaFin) {
            $fechasReales = DB::table($tabla)
                ->selectRaw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_real")
                ->whereNotNull('fecha')
                ->whereBetween(DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y')"), [
                    DB::raw("STR_TO_DATE('$fechaInicio', '%d/%m/%Y')"),
                    DB::raw("STR_TO_DATE('$fechaFin', '%d/%m/%Y')"),
                ])
                ->distinct()
                ->pluck('fecha_real')
                ->map(fn($f) => Carbon::parse($f)->format('Y-m-d'))
                ->sort()
                ->values()
                ->toArray();
        } else {
            $fechasReales = DB::table($tabla)
                ->selectRaw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_real")
                ->whereNotNull('fecha')
                ->orderByRaw("STR_TO_DATE(fecha, '%d/%m/%Y') DESC")
                ->distinct()
                ->limit(15)
                ->pluck('fecha_real')
                ->map(fn($f) => Carbon::parse($f)->format('Y-m-d'))
                ->sort()
                ->values()
                ->toArray();
        }

        $query = DB::table($tabla)
            ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
            ->whereIn(DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y')"), $fechasReales)
            ->orderBy('fecha_ordenada', 'asc')
            ->get();

        $datos = collect($query)->map(function ($fila) {
            $fila->fecha = Carbon::createFromFormat('Y-m-d', $fila->fecha_ordenada)->format('d/m/Y');
            return $fila;
        });

        $datosReporte = [
            'seguimiento' => $this->generarSeguimientoDiario($datos),
            'topCanales' => $this->generarTopCanales($datos),
            'jornada' => $this->generarJornadaAMPM($datos),
            'incidencias' => $this->generarTablaIncidencias($datos),
            'ultimoDia' => $this->generarTablaUltimoDia($datos, $fechasReales),
        ];

        if ($esVistaInertia) {
            return Inertia::render('reportesCanal', compact('datosReporte'));
        }

        return $datosReporte;
    }

    public function obtenerReporteGeneral(Request $request, $tipo)
    {
        $anio = $request->query('anio'); // puede venir vacío ("")
        logger("📥 Año recibido en Laravel: " . ($anio ?: 'Todos'));
    
        $zonasCableColor = [
            'sheet_combarbala',
            'sheet_monte_patria',
            'sheet_ovalle',
            'sheet_salamanca',
            'sheet_illapel',
            'sheet_vicuna',
        ];
    
        $zonasTvRed = [
            'sheet_puerto_natales',
            'sheet_punta_arenas',
        ];
    
        $tablas = $tipo === 'tvred' ? $zonasTvRed : $zonasCableColor;
        $datos = collect();
    
        foreach ($tablas as $tabla) {
            $query = DB::table($tabla)
                ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
                ->whereNotNull('fecha');
    
            // ✅ Solo filtrar por año si fue enviado (no vacío)
            if (!empty($anio)) {
                $query->whereRaw("YEAR(STR_TO_DATE(fecha, '%d/%m/%Y')) = ?", [$anio]);
            }
    
            $registros = $query->get()
                ->filter(fn($fila) => $fila->fecha_ordenada !== null)
                ->map(function ($fila) {
                    $anioDetectado = date('Y', strtotime($fila->fecha_ordenada));
                    $fila->fecha = date('d/m/Y', strtotime($fila->fecha_ordenada));
                    $fila->anio_detectado = $anioDetectado;
                    return $fila;
                });
    
            $datos = $datos->merge($registros);
        }
    
        return Inertia::render('reportesCanal', [
            'datosReporte' => [
                'seguimiento' => $this->generarSeguimientoDiario($datos),
                'topCanales' => $this->generarTopCanales($datos),
                'jornada' => $this->generarJornadaAMPM($datos),
                'incidencias' => $this->generarTablaIncidencias($datos),
                'ultimoDia' => $this->generarTablaUltimoDia($datos, []),
                'resumenCanales' => $this->generarResumenTopCanales($datos),
                'resumenIncidencias' => $this->generarResumenIncidencias($datos),
                'porcentajeIncidencias' => $this->generarGraficoPorcentajeIncidencias($datos), // ✅ AGREGA ESTO
            ],
            'anioActivo' => $anio,
        ]);
        
        
    }
    
    

    public function obtenerAniosDisponibles($tipo)
    {
        return response()->json(
            DB::table('anios')
                ->orderByDesc('anio')
                ->pluck('anio')
        );
    }
    

    private function generarSeguimientoDiario($datos)
    {
        $conteoIncidencias = [];
        $fechasReales = [];

        foreach ($datos as $fila) {
            $fecha = $fila->fecha;
            $fechaCarbon = Carbon::createFromFormat('d/m/Y', $fecha)->format('Y-m-d');
            $fechasReales[$fechaCarbon] = $fecha;

            $incidencia = trim($fila->incidencia ?? '');
            if ($incidencia === '') continue;

            $conteoIncidencias[$incidencia][$fecha] = ($conteoIncidencias[$incidencia][$fecha] ?? 0) + 1;
        }

        ksort($fechasReales);
        $labels = array_values($fechasReales);

        $datasets = [];
        foreach ($conteoIncidencias as $incidencia => $frecuencias) {
            $datasets[] = [
                'label' => $incidencia,
                'data' => array_map(fn($fecha) => $frecuencias[$fecha] ?? 0, $labels),
                'backgroundColor' => $this->colorIncidencia($incidencia),
            ];
        }

        return [
            'data' => ['labels' => $labels, 'datasets' => $datasets],
            'options' => ['responsive' => true],
        ];
    }

    private function generarJornadaAMPM($datos)
    {
        $conteoAM = [];
        $conteoPM = [];
        $fechasReales = [];

        foreach ($datos as $fila) {
            $fecha = $fila->fecha;
            $fechaCarbon = Carbon::createFromFormat('d/m/Y', $fecha)->format('Y-m-d');
            $fechasReales[$fechaCarbon] = $fecha;

            $jornada = strtoupper($fila->jornada ?? 'AM');
            if ($jornada === 'AM') {
                $conteoAM[$fecha] = ($conteoAM[$fecha] ?? 0) + 1;
            } else {
                $conteoPM[$fecha] = ($conteoPM[$fecha] ?? 0) + 1;
            }
        }

        ksort($fechasReales);
        $labels = array_values($fechasReales);

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
            $incidencia = trim($fila->incidencia ?? '');
            if ($incidencia === '') continue;

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

    private function generarTablaUltimoDia($datos, $fechasValidas)
    {
        $fechasFormateadas = collect($fechasValidas)
            ->map(fn($f) => date('d/m/Y', strtotime(str_replace('/', '-', $f))))
            ->toArray();
    
        return collect($datos)
            ->filter(fn($fila) => in_array($fila->fecha, $fechasFormateadas))
            ->sortByDesc(fn($fila) => strtotime(str_replace('/', '-', $fila->fecha)))
            ->map(fn($fila) => [
                'canal'     => $fila->canal,
                'fecha'     => $fila->fecha,
                'incidencia'=> $fila->incidencia,
            ])
            ->values();
    }

    private function cargarColoresIncidencias()
    {
        $incidencias = DB::table('incidence')->pluck('nombre')->toArray();
        $coloresBase = [
            '#ef4444', '#ec4899', '#7e22ce', '#facc15', '#60a5fa',
            '#f97316', '#14b8a6', '#6366f1', '#f43f5e', '#22d3ee',
            '#eab308', '#8b5cf6', '#06b6d4', '#fb7185', '#84cc16',
            '#f59e0b', '#10b981', '#c084fc', '#0ea5e9', '#f87171',
        ];

        $this->coloresIncidencias = [];

        foreach ($incidencias as $index => $nombre) {
            $this->coloresIncidencias[$nombre] = $coloresBase[$index % count($coloresBase)];
        }
    }

    private function colorIncidencia($incidencia)
    {
        return $this->coloresIncidencias[$incidencia] ?? '#64748b';
    }

    private function generarTopCanales($datos)
    {
        $conteo = [];

        foreach ($datos as $fila) {
            $canal = $fila->canal;
            $incidencia = trim($fila->incidencia ?? '');
            if ($incidencia === '') continue;

            if (!isset($conteo[$canal])) {
                $conteo[$canal] = [];
            }
            $conteo[$canal][$incidencia] = ($conteo[$canal][$incidencia] ?? 0) + 1;
        }

        $canalesTop = collect($conteo)
            ->map(fn($incidencias) => array_sum($incidencias))
            ->sortDesc()
            ->take(10)
            ->keys()
            ->toArray();

        $incidenciasUnicas = [];
        foreach ($canalesTop as $canal) {
            foreach (array_keys($conteo[$canal]) as $incidencia) {
                $incidenciasUnicas[$incidencia] = true;
            }
        }
        $incidenciasUnicas = array_keys($incidenciasUnicas);

        $datasets = [];
        foreach ($incidenciasUnicas as $incidencia) {
            $datasets[] = [
                'label' => $incidencia,
                'data' => array_map(fn($canal) => $conteo[$canal][$incidencia] ?? 0, $canalesTop),
                'backgroundColor' => $this->colorIncidencia($incidencia),
                'stack' => 'Stack 0',
            ];
        }

        return [
            'data' => [
                'labels' => $canalesTop,
                'datasets' => $datasets,
            ],
            'options' => [
                'responsive' => true,
                'indexAxis' => 'y',
                'plugins' => [
                    'legend' => ['position' => 'top'],
                ],
                'scales' => [
                    'x' => ['stacked' => true],
                    'y' => ['stacked' => true],
                ],
            ],
        ];
    }

    private function generarResumenTopCanales($datos)
    {
        $conteo = [];

        foreach ($datos as $fila) {
            $canal = trim($fila->canal ?? '');
            $incidencia = trim($fila->incidencia ?? '');
            if ($canal === '' || $incidencia === '') continue;

            $conteo[$canal] = ($conteo[$canal] ?? 0) + 1;
        }

        $total = array_sum($conteo);

        $resumen = collect($conteo)
            ->sortDesc()
            ->map(function ($cantidad, $canal) use ($total) {
                return [
                    'canal' => $canal,
                    'cantidad' => $cantidad,
                    'porcentaje' => number_format(($cantidad / $total) * 100, 2) . '%',
                ];
            })
            ->values();

        return $resumen;
    }

    private function generarResumenIncidencias($datos)
    {
        $conteo = [];

        foreach ($datos as $fila) {
            $incidencia = trim($fila->incidencia ?? '');
            if ($incidencia === '') continue;

            $conteo[$incidencia] = ($conteo[$incidencia] ?? 0) + 1;
        }

        $total = array_sum($conteo);

        $resumen = collect($conteo)
            ->sortDesc()
            ->map(function ($cantidad, $incidencia) use ($total) {
                return [
                    'incidencia' => $incidencia,
                    'cantidad' => $cantidad,
                    'porcentaje' => number_format(($cantidad / $total) * 100, 2) . '%',
                ];
            })
            ->values();

        return $resumen;
    }

    public function obtenerPorcentajeIncidencias(Request $request, $tipo)
    {
        $anio = $request->query('anio');

        $zonasCableColor = [
            'sheet_combarbala',
            'sheet_monte_patria',
            'sheet_ovalle',
            'sheet_salamanca',
            'sheet_illapel',
            'sheet_vicuna',
        ];

        $zonasTvRed = [
            'sheet_puerto_natales',
            'sheet_punta_arenas',
        ];

        $tablas = $tipo === 'tvred' ? $zonasTvRed : $zonasCableColor;
        $datos = collect();

        foreach ($tablas as $tabla) {
            $query = DB::table($tabla)
                ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
                ->whereNotNull('fecha');

            if (!empty($anio)) {
                $query->whereRaw("YEAR(STR_TO_DATE(fecha, '%d/%m/%Y')) = ?", [$anio]);
            }

            $registros = $query->get()
                ->filter(fn($fila) => $fila->fecha_ordenada !== null)
                ->map(function ($fila) {
                    $fila->fecha = date('d/m/Y', strtotime($fila->fecha_ordenada));
                    return $fila;
                });

            $datos = $datos->merge($registros);
        }

        return response()->json(
            $this->generarGraficoPorcentajeIncidencias($datos)
        );
    }

    private function generarGraficoPorcentajeIncidencias($datos)
{
    $conteoPorMes = [];

    foreach ($datos as $fila) {
        if (empty($fila->fecha) || empty($fila->incidencia)) continue;

        try {
            $fecha = Carbon::createFromFormat('d/m/Y', $fila->fecha);
        } catch (\Exception $e) {
            continue; // Salta si la fecha está malformada
        }

        $mes = $fecha->translatedFormat('M Y'); // Ej: "Ene 2025"
        $incidencia = trim($fila->incidencia);

        $conteoPorMes[$mes][$incidencia] = ($conteoPorMes[$mes][$incidencia] ?? 0) + 1;
    }

    $labels = array_keys($conteoPorMes);
    $totalesPorMes = [];

    foreach ($conteoPorMes as $mes => $incidencias) {
        $totalesPorMes[$mes] = array_sum($incidencias);
    }

    // Obtener todas las incidencias únicas
    $todasIncidencias = [];
    foreach ($conteoPorMes as $mes => $incidencias) {
        foreach (array_keys($incidencias) as $incidencia) {
            $todasIncidencias[$incidencia] = true;
        }
    }
    $todasIncidencias = array_keys($todasIncidencias);

    $datasets = [];
    foreach ($todasIncidencias as $incidencia) {
        $datasets[] = [
            'label' => $incidencia,
            'data' => array_map(function ($mes) use ($conteoPorMes, $incidencia, $totalesPorMes) {
                $cantidad = $conteoPorMes[$mes][$incidencia] ?? 0;
                $total = $totalesPorMes[$mes] ?: 1;
                return round(($cantidad / $total) * 100, 2);
            }, $labels),
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



}
