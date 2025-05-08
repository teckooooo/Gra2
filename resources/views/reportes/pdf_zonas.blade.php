<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe General de Zonas</title>
    <style>
        /* 🔧 Forzamos orientación vertical A4 */
        @page {
            size: A4 portrait;
            margin: 15mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            color: #2c3e50;
            width: 100%;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            font-size: 16px;
            margin-bottom: 10px;
        }

        h2 {
            font-size: 14px;
            margin-bottom: 8px;
            border-bottom: 1px solid #ccc;
            color: #1f2937;
        }

        .zona {
            page-break-after: always;
        }

        .titulo-tabla {
            font-weight: bold;
            font-size: 10px;
            margin: 10px 0 4px;
        }

        .bloque {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th, td {
            border: 1px solid #999;
            padding: 4px;
            font-size: 8px;
            text-align: center;
        }

        th {
            background-color: #f3f4f6;
        }

        img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            max-height: 170mm;
            object-fit: contain;
            page-break-inside: avoid;
        }

        .logo {
            height: 20px;
        }

        .encabezado {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>

<div class="encabezado">
    <img class="logo" src="{{ public_path('images/logo.png') }}">
    <div style="flex: 1; text-align: center;">
        <h1>Informe Cable Color</h1>
    </div>
</div>

@php
    $agrupadas = [];
    foreach ($imagenes as $img) {
        $zonaTitulo = explode(' - ', $img['titulo'] ?? 'Sin título');
        $zona = $zonaTitulo[1] ?? 'General';
        $agrupadas[$zona][] = $img;
    }
@endphp

@foreach ($agrupadas as $zona => $imagenesZona)
    <div class="zona">
        <h2>Zona: {{ ucfirst($zona) }}</h2>

        @if (!empty($tablas[$zona]['resumenCanales']))
            <div class="bloque">
                <div class="titulo-tabla">📺 Canales con Incidencias</div>
                <table>
                    <thead><tr><th>Canal</th><th>Cantidad</th><th>%</th></tr></thead>
                    <tbody>
                        @foreach (array_slice($tablas[$zona]['resumenCanales'], 0, 15) as $fila)
                            <tr>
                                <td>{{ $fila['canal'] }}</td>
                                <td>{{ $fila['cantidad'] }}</td>
                                <td>{{ $fila['porcentaje'] }}%</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        @if (!empty($tablas[$zona]['resumenIncidencias']))
            <div class="bloque">
                <div class="titulo-tabla">📊 Incidencias registradas</div>
                <table>
                    <thead><tr><th>Incidencia</th><th>Cantidad</th><th>%</th></tr></thead>
                    <tbody>
                        @foreach (array_slice($tablas[$zona]['resumenIncidencias'], 0, 15) as $fila)
                            <tr>
                                <td>{{ $fila['incidencia'] }}</td>
                                <td>{{ $fila['cantidad'] }}</td>
                                <td>{{ $fila['porcentaje'] }}%</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        @if (!empty($tablas[$zona]['ultimoDia']))
            <div class="bloque">
                <div class="titulo-tabla">🗓️ Último Día</div>
                <table>
                    <thead><tr><th>Canal</th><th>Fecha</th><th>Incidencia</th></tr></thead>
                    <tbody>
                        @foreach (array_slice($tablas[$zona]['ultimoDia'], 0, 10) as $fila)
                            <tr>
                                <td>{{ $fila['canal'] }}</td>
                                <td>{{ $fila['fecha'] }}</td>
                                <td>{{ $fila['incidencia'] }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        {{-- 📈 Gráficos --}}
        @foreach ($imagenesZona as $imagen)
            @php 
                $titulo = $imagen['titulo'] ?? '';
                $base64 = str_replace(["\n", "\r", ' '], '', $imagen['base64'] ?? '');
            @endphp
            @if (
                str_contains($titulo, 'Resumen General') || 
                str_contains($titulo, 'PorcentajeIncidencias') ||
                str_contains($titulo, 'SeguimientoDiario') ||
                str_contains($titulo, 'JornadaAMPM') ||
                str_contains($titulo, 'TopCanales')
            )
                <div class="bloque">
                    <div class="titulo-tabla">📈 {{ $titulo }}</div>
                    <img src="{{ $base64 }}" alt="{{ $titulo }}">
                </div>
            @endif
        @endforeach
    </div>
@endforeach

</body>
</html>
