<?php

namespace App\Console\Commands;

use App\Mail\ReporteGeneradoMultiple;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class EnviarReportesCommand extends Command
{
    protected $signature = 'reportes:enviar';
    protected $description = 'Enviar reportes automáticos a usuarios con permiso asignado';

    public function handle()
    {
        \Log::info('✅ Comando reportes:enviar ejecutado');

        $usuarios = DB::table('config_reporte_horas')->pluck('user_id');

        foreach ($usuarios as $userId) {
            $user = User::find($userId);
            \Log::info("🔍 Verificando usuario ID: $userId");

            if (!$user) {
                \Log::warning("⚠️ Usuario ID $userId no encontrado.");
                continue;
            }

            if (!$user->getPermissionNames()->contains('Recibir Reporte Correo')) {
                \Log::info("⛔ Usuario {$user->email} no tiene permiso para recibir reportes.");
                continue;
            }

            \Log::info("📤 Enviando correo de prueba a: nachito.qaa@gmail.com (copia a sbarraza.araya0@gmail.com)");

            $datos = $this->obtenerDatosParaUsuario($user);

            $pdfGeneral = Pdf::loadView('pdf.reportes.comercial.pdf', ['datos' => $datos])->output();
            $pdfZonas = Pdf::loadView('pdf.reportes.comercial.pdf_zonas', ['datos' => $datos])->output();

            // Enviar correo a dirección de prueba + copia a tu Gmail
            Mail::to('nachito.qaa@gmail.com')
                ->cc('sbarraza.araya0@gmail.com')
                ->send(new ReporteGeneradoMultiple([
                    ['pdf' => $pdfGeneral, 'nombre' => 'reporte_general.pdf'],
                    ['pdf' => $pdfZonas, 'nombre' => 'reporte_zonas.pdf'],
                ], $user));
        }
    }

    private function obtenerDatosParaUsuario($user)
    {
        return [
            'nombre' => $user->name,
            'fecha' => now()->format('d/m/Y H:i'),
        ];
    }
}
