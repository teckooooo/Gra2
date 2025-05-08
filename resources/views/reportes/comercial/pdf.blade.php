<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Comercial</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #333;
    }
    .encabezado {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
    .logo {
      height: 20px;
    }
    .titulo-principal {
      text-align: center;
      flex: 1;
      font-size: 18px;
      font-weight: bold;
      margin-right: 50px;
    }
    .subtitulo {
      font-size: 14px;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 6px;
    }
    .grafico {
      text-align: center;
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    .bloque {
      page-break-inside: avoid;
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #999;
      padding: 6px 8px;
      text-align: center;
    }
    th {
      background-color: #f3f4f6;
    }
  </style>
</head>
<body>
  <div class="encabezado">
    <img class="logo" src="{{ public_path('images/logo.png') }}">
    <div style="flex: 1; text-align: center;">
      <h1>Informe Cable Color - Comercial</h1>
    </div>
  </div>
  <p><strong>Fecha de generación:</strong> {{ $fecha }}</p>

  {{-- 🔵 ALTAS agrupadas --}}
  @php
    $tiposAltas = ['Ejecutivo', 'Sucursal', 'Tipo OT', 'Mes/Sucursal', 'Línea'];
  @endphp

  @foreach ($tiposAltas as $tipo)
    @php
      $titulo = "Gráfico $tipo Altas";
    @endphp
    @foreach ($imagenes as $img)
      @if ($img['titulo'] === $titulo)
        <div class="bloque">
          <div class="subtitulo">{{ $img['titulo'] }}</div>
          <div class="grafico">
            <img src="{{ $img['base64'] }}" style="max-width: 100%; max-height: 400px;">
          </div>
        </div>
      @endif
    @endforeach
  @endforeach

  {{-- Tabla Altas --}}
  @if (!empty($tablas['TablaAltas']))
    <div class="bloque">
      <div class="subtitulo">📋 Resumen Altas por Mes y Sucursal</div>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            @foreach(array_keys($tablas['TablaAltas'][0]['valores']) as $sucursal)
              <th>{{ $sucursal }}</th>
            @endforeach
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          @foreach ($tablas['TablaAltas'] as $fila)
            <tr>
              <td>{{ ucfirst($fila['mes']) }}</td>
              @foreach($fila['valores'] as $valor)
                <td>{{ $valor }}</td>
              @endforeach
              <td>{{ $fila['total'] }}</td>
            </tr>
          @endforeach
        </tbody>
      </table>
    </div>
  @endif

  {{-- 🔴 BAJAS agrupadas --}}
  @php
    $tiposBajas = ['Ejecutivo', 'Sucursal', 'Tipo OT', 'Mes/Sucursal', 'Línea'];
  @endphp

  @foreach ($tiposBajas as $tipo)
    @php
      $titulo = "Gráfico $tipo Bajas";
    @endphp
    @foreach ($imagenes as $img)
      @if ($img['titulo'] === $titulo)
        <div class="bloque">
          <div class="subtitulo">{{ $img['titulo'] }}</div>
          <div class="grafico">
            <img src="{{ $img['base64'] }}" style="max-width: 100%; max-height: 400px;">
          </div>
        </div>
      @endif
    @endforeach
  @endforeach

  {{-- Tabla Bajas --}}
  @if (!empty($tablas['TablaBajas']))
    <div class="bloque">
      <div class="subtitulo">📋 Resumen Bajas por Mes y Sucursal</div>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            @foreach(array_keys($tablas['TablaBajas'][0]['valores']) as $sucursal)
              <th>{{ $sucursal }}</th>
            @endforeach
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          @foreach ($tablas['TablaBajas'] as $fila)
            <tr>
              <td>{{ ucfirst($fila['mes']) }}</td>
              @foreach($fila['valores'] as $valor)
                <td>{{ $valor }}</td>
              @endforeach
              <td>{{ $fila['total'] }}</td>
            </tr>
          @endforeach
        </tbody>
      </table>
    </div>
  @endif

</body>
</html>
