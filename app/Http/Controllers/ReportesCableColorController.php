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
            $query = DB::table($tabla)
                ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
                ->whereBetween(DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y')"), [
                    DB::raw("STR_TO_DATE('$fechaInicio', '%d/%m/%Y')"),
                    DB::raw("STR_TO_DATE('$fechaFin', '%d/%m/%Y')"),
                ])
                ->orderBy('fecha_ordenada', 'asc')
                ->get();
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

            $query = DB::table($tabla)
                ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
                ->whereIn(DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y')"), $fechasReales)
                ->orderBy('fecha_ordenada', 'asc')
                ->get();
        }

        $datos = collect($query)->map(function ($fila) {
            $fila->fecha = Carbon::createFromFormat('Y-m-d', $fila->fecha_ordenada)->format('d/m/Y');
            return $fila;
        });

        $datosReporte = [
            'seguimiento' => $this->generarSeguimientoDiario($datos),
            'topCanales' => $this->generarTopCanales($datos),
            'jornada' => $this->generarJornadaAMPM($datos),
            'incidencias' => $this->generarTablaIncidencias($datos),
            'ultimoDia' => $this->generarTablaUltimoDia($datos),
        ];

        if ($esVistaInertia) {
            return Inertia::render('reportesCanal', compact('datosReporte'));
        }

        return $datosReporte;
    }

    private function generarSeguimientoDiario($datos)
    {
        $conteoIncidencias = [];
        $fechasReales = [];
    
        foreach ($datos as $fila) {
            $fecha = $fila->fecha;
            $fechaCarbon = Carbon::createFromFormat('d/m/Y', $fecha)->format('Y-m-d'); // clave para ordenar
            $fechasReales[$fechaCarbon] = $fecha; // usamos el formato ISO para orden, pero conservamos original
    
            $incidencia = trim($fila->incidencia ?? '');
            if ($incidencia === '') continue;
    
            $conteoIncidencias[$incidencia][$fecha] = ($conteoIncidencias[$incidencia][$fecha] ?? 0) + 1;
        }
    
        ksort($fechasReales); // orden cronológico real
        $labels = array_values($fechasReales); // conservamos el formato original
    
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

    private function generarTablaUltimoDia($datos)
    {
        return collect($datos)
            ->sortBy(function ($fila) {
                return Carbon::createFromFormat('d/m/Y', $fila->fecha)->timestamp;
            })
            ->take(10)
            ->map(fn($fila) => [
                'canal' => $fila->canal,
                'fecha' => $fila->fecha,
                'incidencia' => $fila->incidencia,
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
}
