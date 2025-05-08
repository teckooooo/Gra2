<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

use Barryvdh\Snappy\Facades\SnappyPdf as PDF;

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

        // 📅 Obtener fechas reales según rango o últimos 15 días
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

        // 🔍 Obtener datos de esas fechas
        $query = DB::table($tabla)
            ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
            ->whereIn(DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y')"), $fechasReales)
            ->orderBy('fecha_ordenada', 'asc')
            ->get();

        $datos = collect($query)->map(function ($fila) {
            $fila->fecha = Carbon::createFromFormat('Y-m-d', $fila->fecha_ordenada)->format('d/m/Y');
            return $fila;
        });

        // 🧠 Construir datos de zona
        $datosReporte = [
            'seguimiento' => $this->generarSeguimientoDiario($datos),
            'topCanales' => $this->generarTopCanales($datos),
            'jornada' => $this->generarJornadaAMPM($datos),
            'incidencias' => $this->generarTablaIncidencias($datos),
            'ultimoDia' => $this->generarTablaUltimoDia($datos, $fechasReales),
            'resumenCanales' => $this->generarResumenTopCanales($datos),
            'resumenIncidencias' => $this->generarResumenIncidencias($datos),
            'porcentajeIncidencias' => $this->generarGraficoPorcentajeIncidencias($datos),
        ];

        // 🔄 Si es una vista individual, renderizar con Inertia
        if ($esVistaInertia) {
            return Inertia::render('reportesCanal', compact('datosReporte'));
        }

        return $datosReporte;
    }


    public function obtenerReporteGeneral(Request $request, $tipo)
    {
        $anio = $request->query('anio');
        logger("📥 Año recibido en Laravel: " . ($anio ?: 'Todos'));

        $zonasCableColor = [
            'combarbala' => 'sheet_combarbala',
            'monte_patria' => 'sheet_monte_patria',
            'ovalle' => 'sheet_ovalle',
            'salamanca' => 'sheet_salamanca',
            'illapel' => 'sheet_illapel',
            'vicuna' => 'sheet_vicuna',
        ];

        $zonasTvRed = [
            'puerto_natales' => 'sheet_puerto_natales',
            'punta_arenas' => 'sheet_punta_arenas',
        ];

        $zonas = $tipo === 'tvred' ? $zonasTvRed : $zonasCableColor;

        $datos = collect(); // datos generales por año
        $datosPorZona = []; // datos por zona con últimos 15 días

        foreach ($zonas as $clave => $tabla) {
            // 🔹 Acumula datos para reportes generales (por año si se indicó)
            $query = DB::table($tabla)
                ->select('*', DB::raw("STR_TO_DATE(fecha, '%d/%m/%Y') as fecha_ordenada"))
                ->whereNotNull('fecha');

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

            // 🔸 Carga últimos 15 días de esta zona individual
            $datosPorZona[$clave] = $this->generarDatosParaZona($clave, false);
        }

        return Inertia::render('reportesCanal', [
            'datosReporte' => [
                'resumenCanales' => $this->generarResumenTopCanales($datos),
                'resumenIncidencias' => $this->generarResumenIncidencias($datos),
                'porcentajeIncidencias' => $this->generarGraficoPorcentajeIncidencias($datos),
                'zonas' => $datosPorZona,
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

    public function generarPDF(Request $request, $tipo)
{
    // 🔧 Opción 1: Aumentar límites
    ini_set('memory_limit', '512M');
    set_time_limit(120);

    $imagenes = json_decode($request->input('imagenes'), true) ?? [];
    $tablas = json_decode($request->input('tablas'), true) ?? [];
    $zonasGraficos = json_decode($request->input('zonasGraficos'), true) ?? [];

    $anio = $request->query('anio') ?? 'Todos';
    $zonaNombre = $tipo === 'cablecolor' ? 'Cable Color' : 'TV Red';

    // 📝 Debug opcional
    logger('📄 Generando PDF básico', compact('anio', 'zonaNombre'));

    $pdf = Pdf::loadView('reportes.pdf-graficos', [
        'imagenes' => $imagenes,
        'anio' => $anio,
        'zona' => ucfirst($zonaNombre),
        'fechaGeneracion' => now()->format('d/m/Y H:i'),
        'TablaResumenCanales' => $tablas['TablaResumenCanales'] ?? '',
        'TablaResumenIncidencias' => $tablas['TablaResumenIncidencias'] ?? '',
        'zonasGraficos' => $zonasGraficos,
    ])->setPaper('a4', 'portrait');

    return $pdf->stream("informe-{$zonaNombre}-{$anio}.pdf");
}


public function generarPDFconGraficos(Request $request, $tipo)
{
    ini_set('memory_limit', '512M');
    set_time_limit(120);

    $anio = $request->query('anio');

    // 👇 Forzar parseo a JSON
    $imagenes = is_string($request->input('imagenes')) ? json_decode($request->input('imagenes'), true) : $request->input('imagenes', []);
    $tablas = is_string($request->input('tablas')) ? json_decode($request->input('tablas'), true) : $request->input('tablas', []);
    $zonasGraficos = is_string($request->input('zonasGraficos')) ? json_decode($request->input('zonasGraficos'), true) : $request->input('zonasGraficos', []);

    $TablaResumenCanales = $tablas['TablaResumenCanales'] ?? '';
    $TablaResumenIncidencias = $tablas['TablaResumenIncidencias'] ?? '';
    $zonaNombre = $tipo === 'cablecolor' ? 'Cable Color' : 'TV Red';

    logger('🧾 Zonas Graficos recibidos:', array_keys($zonasGraficos));

    $pdf = PDF::loadView('pdf.pdf-graficos', [
        'zona' => ucfirst($zonaNombre),
        'anio' => $anio ?? 'Todos',
        'fechaGeneracion' => now()->format('d/m/Y H:i'),
        'imagenes' => $imagenes,
        'resumenCanales' => $TablaResumenCanales,
        'resumenIncidencias' => $TablaResumenIncidencias,
        'zonasGraficos' => $zonasGraficos,
    ])->setPaper('a4');

    return $pdf->inline("informe-{$zonaNombre}-{$anio}.pdf");
}

public function exportarPDF(Request $request)
{
    try {
        logger()->debug('📤 Iniciando exportación de PDF...');

        $imagenes = $request->input('imagenes') ?? [];
        $tablas = $request->input('tablas') ?? [];

        // ✅ Log para verificar que llegan las tablas
        logger()->debug('📊 Tablas recibidas');

        // ✅ Log para verificar que llegan las imágenes
        logger()->debug('🖼️ Imágenes recibidas: ' . count($imagenes));
        foreach ($imagenes as $i => $img) {
            $titulo = $img['titulo'] ?? '(sin título)';
            $base64 = isset($img['base64']) && str_starts_with($img['base64'], 'data:image/')
                ? '✅ OK'
                : '❌ Base64 inválido o no comienza con data:image/';
            logger()->debug("📸 Imagen #$i: $titulo — $base64");
        }

        if (!is_array($imagenes) || empty($imagenes)) {
            logger()->debug('⚠️ No se recibieron imágenes válidas');
            return response()->json(['error' => 'No se recibieron imágenes válidas.'], 400);
        }

        foreach ($imagenes as $img) {
            if (empty($img['base64']) || !str_starts_with($img['base64'], 'data:image/')) {
                return response()->json(['error' => 'Una o más imágenes no son válidas.'], 400);
            }
        }

        
        logger()->debug('✅ Preparando PDF para generar...');
        
        $pdf = Pdf::loadView('reportes.pdf_zonas', [
                'imagenes' => $imagenes,
                'tablas' => $tablas,
                'fechaGeneracion' => now()->format('d/m/Y H:i'),
                'zona' => 'General',
            ])
            ->setOptions([
                'enable-local-file-access' => true,
                'no-stop-slow-scripts' => true,
                'disable-javascript' => true,
                'load-error-handling' => 'ignore',
                'load-media-error-handling' => 'ignore',
                'disable-external-links' => true,
                'disable-internal-links' => true,
            ])
            ->setPaper('a4', 'landscape');

        logger()->debug('✅ PDF generado correctamente, listo para descargar');
        return $pdf->download('reporte_general.pdf');

    } catch (\Throwable $e) {
        logger()->error('❌ Error exportando PDF', [
            'mensaje' => $e->getMessage(),
            'linea' => $e->getLine(),
            'archivo' => $e->getFile(),
        ]);
        return response()->json([
            'error' => $e->getMessage(),
            'linea' => $e->getLine(),
            'archivo' => $e->getFile(),
        ], 500);
    }
}
public function cargarDummy()
{
    $imagenes = [
        [
            'titulo' => 'GraficoPorcentajeIncidencias - general',
            'base64' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' // base64 corto real
        ]
    ];

    $tablas = [
        'general' => [
            'resumenCanales' => [
                ['canal' => 'TVE HD', 'cantidad' => 215, 'porcentaje' => 8.62],
                ['canal' => 'VIA X', 'cantidad' => 120, 'porcentaje' => 4.81],
            ],
            'resumenIncidencias' => [
                ['incidencia' => 'Pixelado', 'cantidad' => 100, 'porcentaje' => 40],
                ['incidencia' => 'Sin señal', 'cantidad' => 50, 'porcentaje' => 20],
            ],
            'ultimoDia' => [
                ['canal' => 'TVE HD', 'fecha' => '01/05/2025', 'incidencia' => 'Pixelado'],
            ]
        ]
    ];

    session(['imagenes' => $imagenes, 'tablas' => $tablas]);
    return redirect()->route('vista.pdf.zonas');
}




}