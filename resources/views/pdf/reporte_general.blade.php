<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte General</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }

        h1, h2 {
            color: #2c3e50;
            text-align: center;
        }

        .grafico {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .grafico img {
            width: 100%;
            max-height: 400px;
            object-fit: contain;
            border: 1px solid #ccc;
        }

        .separador {
            margin: 40px 0;
            border-top: 2px dashed #ccc;
        }
    </style>
</head>
<body>

    <h1>Informe General - {{ $zona ?? 'Zona' }}</h1>
    <p>Generado el {{ $fechaGeneracion ?? now() }}</p>

    @if (!empty($imagenes))
        @foreach ($imagenes as $titulo => $imgBase64)
            <div class="grafico">
                <h2>{{ $titulo }}</h2>
                <img src="{{ $imgBase64 }}" alt="Gráfico {{ $titulo }}">
            </div>
        @endforeach
    @else
        <p>No se encontraron gráficos para mostrar.</p>
    @endif

</body>
</html>
