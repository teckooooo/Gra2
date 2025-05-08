<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Mail\ReporteGenerado;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class EnviarReportesCommand extends Command
{
    protected $signature = 'reportes:enviar';
    protected $description = 'Enviar reportes automáticos a usuarios con permiso asignado';

    public function handle()
    {
        $horaActual = now()->format('H:i:s');

        $usuarios = DB::table('config_reporte_horas')
            ->where('hora', $horaActual)
            ->pluck('user_id');

        foreach ($usuarios as $userId) {
            $user = User::find($userId);
            if (!$user || !$user->hasPermissionTo('Recibir reporte correo')) continue;

            // Aquí generas el PDF (puedes usar DomPDF, Snappy, etc.)
            $pdf = PDF::loadView('pdf.reporte-automatica', [
                'datos' => $this->obtenerDatosParaUsuario($user),
            ])->output();

            Mail::to($user->email)->send(new ReporteGenerado($pdf));
        }
    }

    private function obtenerDatosParaUsuario($user)
    {
        // Devuelve la información personalizada del reporte
        return [
            'nombre' => $user->name,
            'fecha' => now()->format('d/m/Y H:i'),
        ];
    }
}
