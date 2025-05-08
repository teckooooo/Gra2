<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Automático</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 20px;
        }
        h1 {
            color: #2e6da4;
            text-align: center;
        }
        .info {
            margin-top: 30px;
        }
        .info p {
            font-size: 14px;
            margin: 8px 0;
        }
        .footer {
            position: absolute;
            bottom: 30px;
            font-size: 12px;
            color: #888;
            text-align: center;
            width: 100%;
        }
    </style>
</head>
<body>
    <h1>📊 Reporte Automático</h1>

    <div class="info">
        <p><strong>Usuario:</strong> {{ $datos['nombre'] }}</p>
        <p><strong>Fecha de generación:</strong> {{ $datos['fecha'] }}</p>
    </div>

    <div class="info" style="margin-top: 40px;">
        <p>Este es un reporte automático enviado por el sistema de monitoreo. Si tienes dudas o necesitas más información, comunícate con el área correspondiente.</p>
    </div>

    <div class="footer">
        CableColor &copy; {{ date('Y') }} - Sistema de Reportes Automáticos
    </div>
</body>
</html>
