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
    .titulo {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
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
  <div class="titulo">📊 Reporte Comercial</div>
  <p><strong>Fecha de generación:</strong> {{ $fecha }}</p>

  {{-- Gráficos --}}
  @foreach ($imagenes as $imagen)
    @php
      $titulo = $imagen['titulo'] ?? '';
      $base64 = $imagen['base64'] ?? '';
    @endphp
    @if (!empty($base64))
      <div class="subtitulo">{{ $titulo }}</div>
      <div class="grafico">
        <img src="{{ $base64 }}" style="max-width: 100%; max-height: 400px;">
      </div>
    @endif
  @endforeach

  {{-- Tabla de Resumen --}}
  @if (!empty($tablas['Resumen']))
    <div class="subtitulo">📋 Tabla Resumen Altas y Bajas</div>
    <table>
      <thead>
        <tr>
          <th>Sucursal</th>
          <th>Altas</th>
          <th>Bajas</th>
          <th>Diferencia</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($tablas['Resumen'] as $fila)
          <tr>
            <td>{{ $fila['sucursal'] ?? '-' }}</td>
            <td>{{ $fila['altas'] ?? '0' }}</td>
            <td>{{ $fila['bajas'] ?? '0' }}</td>
            <td>{{ $fila['diferencia'] ?? '0' }}</td>
          </tr>
        @endforeach
      </tbody>
    </table>
  @endif

</body>
</html>
