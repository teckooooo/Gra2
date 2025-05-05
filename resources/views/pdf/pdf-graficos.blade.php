<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Gráfico - {{ $zona }}</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; }
    h1, h2, h3 { color: #1f2937; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; }
    th { background-color: #f3f4f6; }
    img { max-width: 100%; height: auto; margin-bottom: 15px; }
    .zona-section { margin-top: 30px; padding-top: 20px; border-top: 2px solid #ccc; }
  </style>
</head>
<body>
  <h1>Informe Gráfico - {{ $zona }}</h1>
  <p><strong>Año:</strong> {{ $anio }}</p>
  <p><strong>Fecha de generación:</strong> {{ $fechaGeneracion }}</p>

  <h2>Resumen General</h2>
  @foreach ($imagenes as $titulo => $base64)
    <h3>{{ str_replace('_', ' ', $titulo) }}</h3>
    <img src="{{ $base64 }}" alt="{{ $titulo }}">
  @endforeach

  <h3>Resumen por Canal</h3>
  {!! $TablaResumenCanales !!}

  <h3>Resumen por Incidencia</h3>
  {!! $TablaResumenIncidencias !!}

  @php use Illuminate\Support\Str; @endphp

  @isset($zonasGraficos)
    @if (!empty($zonasGraficos))
      @foreach ($zonasGraficos as $zona => $elementos)
        <div class="zona-section">
          <h2>{{ ucfirst($zona) }}</h2>

          @foreach ($elementos as $id => $contenido)
            @if(Str::contains($id, ['SeguimientoDiario', 'TopCanales', 'JornadaAMPM']))
              <img src="{{ $contenido }}" alt="{{ $id }}" style="width:100%; margin-bottom:20px;">
            @else
              {!! $contenido !!}
            @endif
          @endforeach

        </div>
      @endforeach
    @endif
  @endisset

</body>
</html>
