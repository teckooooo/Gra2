<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe General de Canales</title>
  <style>
    @page {
      margin: 5mm 8mm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 10px;
      color: #2c3e50;
      margin: 0;
      padding: 0;
    }

    .encabezado {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      margin-bottom: 8px;
      padding-bottom: 6px;
    }

    .logo {
      height: 20px;
    }

    h1 {
      text-align: center;
      font-size: 16px;
    }

    h2 {
      font-size: 13px;
      margin-top: 8px;
      margin-bottom: 4px;
      font-weight: bold;
      color: #1f2937;
    }

    .subtitulo {
      font-size: 11px;
      font-weight: bold;
      margin: 6px 0 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0 10px;
    }

    th, td {
      border: 1px solid #999;
      padding: 4px;
      font-size: 9px;
      text-align: center;
    }

    th {
      background-color: #f3f4f6;
    }

    .fila-graficos {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      page-break-inside: avoid;
      margin-bottom: 6px;
    }

    .fila-graficos.una-sola {
      justify-content: center;
    }

    .grafico-lado {
      width: 90%;
      text-align: center;
    }

    .grafico-lado img {
      width: 100%;
      max-height: 600px;
      object-fit: contain;
      margin: 0 auto;
    }
  </style>
</head>
<body>

<div class="encabezado">
  <img class="logo" src="{{ public_path('images/logo.png') }}">
  <div style="flex: 1; text-align: center;">
    <h1>Informe Cable Color - Canales</h1>
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
    $graficosZona = [];
    foreach ($imagenesZona as $img) {
      $titulo = $img['titulo'] ?? '';
      $base64 = trim($img['base64'] ?? '');
      if (!Str::startsWith($base64, 'data:image')) {
        $base64 = 'data:image/png;base64,' . $base64;
      }

      if (!empty($base64) && strlen($base64) > 100 && (
        str_contains($titulo, 'Resumen General') ||
        str_contains($titulo, 'PorcentajeIncidencias') ||
        str_contains($titulo, 'SeguimientoDiario') ||
        str_contains($titulo, 'JornadaAMPM') ||
        str_contains($titulo, 'TopCanales')
      )) {
        $graficosZona[] = ['titulo' => $titulo, 'base64' => $base64];
      }
    }

    $primerGrafico = array_shift($graficosZona);
    $pares = array_chunk($graficosZona, 2);
  @endphp

  <div class="zona" @if (!($loop->last && count($pares) === 0)) style="page-break-after: always;" @endif>
    <h2>Zona: {{ ucfirst($zona) }}</h2>

    @if (!empty($tablas[$zona]['resumenCanales']))
      <div class="subtitulo">Canales con Incidencias</div>
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
    @endif

    @if (!empty($tablas[$zona]['resumenIncidencias']))
      <div class="subtitulo">Incidencias registradas</div>
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
    @endif

    @if (!empty($tablas[$zona]['ultimoDia']))
      <div class="subtitulo">Último Día</div>
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
    @endif

    @if ($primerGrafico)
      <div class="grafico-lado" style="margin: 10px auto 20px;">
        <div class="subtitulo">{{ $primerGrafico['titulo'] }}</div>
        <img src="{{ $primerGrafico['base64'] }}" alt="{{ $primerGrafico['titulo'] }}">
      </div>
    @endif
  </div>

  @foreach ($pares as $grupo)
    <div class="zona" @if (!($loop->last && $loop->parent->last)) style="page-break-after: always;" @endif>
      <div class="fila-graficos {{ count($grupo) === 1 ? 'una-sola' : '' }}">
        @foreach ($grupo as $grafico)
          <div class="grafico-lado">
            <div class="subtitulo">{{ $grafico['titulo'] }}</div>
            <img src="{{ $grafico['base64'] }}" alt="{{ $grafico['titulo'] }}">
          </div>
        @endforeach
      </div>
    </div>
  @endforeach
@endforeach

</body>
</html>
