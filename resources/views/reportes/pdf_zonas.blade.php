<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe General de Zonas</title>
    <link rel="stylesheet" href="{{ public_path('css/informe-zonas.css') }}">
</head>
<body>

<div class="encabezado">
    <img class="logo" src="{{ public_path('images/logo.png') }}">
    <div style="flex: 1; text-align: center;">
        <h1>Informe Cable Color - Canales</h1>
    </div>
</div>
<p><strong>Fecha de generación:</strong> {{ $fecha }}</p>

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

            {{-- PRIMERA HOJA: TABLAS --}}
            <div class="zona">
                <h2>Zona: {{ ucfirst($zona) }} - Tablas</h2>
                <div class="contenedor">
                    @if (!empty($tablas[$zona]['resumenIncidencias']))
                        <div class="tabla">
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
                        <div class="tabla">
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
                </div>
            </div>

            {{-- SEGUNDA HOJA: GRÁFICOS --}}
            <div class="zona">
                <h2>Zona: {{ ucfirst($zona) }} - Gráficos</h2>
                @foreach ($imagenesZona as $imagen)
                    @php 
                        $titulo = $imagen['titulo'] ?? '';
                        $base64 = str_replace(["\n", "\r", ' '], '', $imagen['base64'] ?? '');
                    @endphp
                    @if (
                        (str_contains($titulo, 'SeguimientoDiario') || 
                        str_contains($titulo, 'JornadaAMPM') || 
                        str_contains($titulo, 'TopCanales')) 
                        && !empty($base64)
                    )
                        <div class="bloque-grafico">
                            <div class="titulo-tabla">📈 {{ $titulo }}</div>
                            <img src="{{ $base64 }}" alt="{{ $titulo }}">
                        </div>
                    @endif
                @endforeach
            </div>
        @endif
    </div>
@endforeach

</body>
</html>
