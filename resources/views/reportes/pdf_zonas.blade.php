<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe General de Zonas</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 15mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            color: #2c3e50;
        }

        h1 {
            text-align: center;
            font-size: 16px;
            margin-bottom: 4px;
        }

        h2 {
            font-size: 14px;
            margin-bottom: 4px;
            border-bottom: 1px solid #ccc;
            color: #1f2937;
        }

        .zona {
            page-break-after: always;
            margin-bottom: 10px;
        }

        .fila {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 8px;
        }

        .bloque {
            width: 48%;
        }

        .bloque-grafico {
            width: 100%;
            margin-top: 10px;
        }

        .bloque-grafico img, .div5 img {
            width: 100%;
            height: auto;
            object-fit: contain;
            max-height: 220px;
            border: 1px solid #ccc;
        }

        .tabla {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            table-layout: fixed;
        }

        .tabla th, .tabla td {
            border: 1px solid #ccc;
            padding: 3px;
            font-size: 8px;
            text-align: left;
            word-break: break-word;
        }

        .tabla th {
            background-color: #f1f1f1;
        }

        .titulo-tabla {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 4px;
        }

        .logo {
            width: 120px;
        }

        .encabezado {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .parent {
    display: grid;
    grid-template-columns: 1fr 1.5fr; /* Tabla más angosta, gráfico más ancho */
    gap: 10px;
    align-items: start;
}


        .div2 {
            grid-column: span 2;
            grid-row: span 4;
            grid-column-start: 1;
            grid-row-start: 2;
        }

        .div4 {
            grid-row: span 2;
            grid-column-start: 3;
            grid-row-start: 2;
        }

        .div5 {
    grid-column: span 3;
    grid-column-start: 5;   /* o 4 si quieres más a la derecha */
    grid-row: span 2;
    grid-row-start: 1;      /* 🔼 Esto sube el gráfico arriba */
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

    @php
        logger()->debug('📄 Renderizando zona en Blade', [
            'zona' => $zona,
            'cantidad_imagenes' => count($imagenesZona)
        ]);
    @endphp

    <div class="zona">
        <h2>Zona: {{ ucfirst($zona) }}</h2>

        {{-- GENERAL --}}
        @if (strtolower($zona) === 'general')
{{-- 🔲 CONTENEDOR FLEX PARA TABLAS Y GRÁFICO --}}
<table style="width: 100%; table-layout: fixed;">
    <tr>
        {{-- 🧱 COLUMNA IZQUIERDA: Tablas (más angosta) --}}
        <td style="width: 42%; vertical-align: top; padding-right: 10px;">
            {{-- 📺 Canales con Incidencias --}}
            @if (!empty($tablas[$zona]['resumenCanales']))
                <div class="titulo-tabla">📺 Canales con Incidencias</div>
                <table class="tabla">
                    <thead>
                        <tr><th>Canal</th><th>Cantidad</th><th>%</th></tr>
                    </thead>
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
            @endif

            {{-- 📊 Incidencias registradas --}}
            @if (!empty($tablas[$zona]['resumenIncidencias']))
                <div class="titulo-tabla" style="margin-top: 15px;">📊 Incidencias registradas</div>
                <table class="tabla">
                    <thead>
                        <tr><th>Incidencia</th><th>Cantidad</th><th>%</th></tr>
                    </thead>
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
            @endif
        </td>

        {{-- 📈 COLUMNA DERECHA: Gráfico (más ancho) --}}
        <td style="width: 58%; vertical-align: top;">
            @foreach ($imagenesZona as $imagen)
                @php 
                    $titulo = $imagen['titulo'] ?? '';
                    $base64 = str_replace(["\n", "\r", ' '], '', $imagen['base64'] ?? '');
                @endphp
                @if (
                    (stripos($titulo, 'Resumen General') !== false || 
                     stripos($titulo, 'PorcentajeIncidencias') !== false)
                    && !empty($base64)
                )
                    <div class="titulo-tabla">📈 {{ $titulo }}</div>
                    <img src="{{ $base64 }}" alt="{{ $titulo }}" style="width: 100%; max-height: 500px; object-fit: contain;">
                @endif
            @endforeach
        </td>
    </tr>
</table>




            </div>
        @else
            {{-- ZONAS SECUNDARIAS --}}
            <div class="fila">
                @if (!empty($tablas[$zona]['resumenCanales']))
                    <div class="bloque">
                        <div class="titulo-tabla">📺 Canales con Incidencias</div>
                        <table class="tabla">
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
                        <table class="tabla">
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
            </div>

            {{-- Gráficos dinámicos --}}
            @foreach ($imagenesZona as $imagen)
                @php 
                    $titulo = $imagen['titulo'] ?? '';
                    $base64 = str_replace(["\n", "\r", ' '], '', $imagen['base64'] ?? '');
                @endphp
                @if (
                    (str_contains($titulo, 'SeguimientoDiario') || str_contains($titulo, 'Jornada AMPM') || str_contains($titulo, 'TopCanales')) 
                    && !empty($base64)
                )
                    <div class="bloque-grafico">
                        <div class="titulo-tabla">📈 {{ $titulo }}</div>
                        <img src="{{ $base64 }}" alt="{{ $titulo }}">
                    </div>
                @endif
            @endforeach

            {{-- Último día --}}
            @if (!empty($tablas[$zona]['ultimoDia']))
                <div class="bloque" style="margin-top: 10px;">
                    <div class="titulo-tabla">🗓️ Último Día</div>
                    <table class="tabla">
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
        @endif
    </div>
@endforeach

</body>
</html>
