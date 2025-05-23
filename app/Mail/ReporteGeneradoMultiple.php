<?php
// app/Mail/ReporteGeneradoMultiple.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReporteGeneradoMultiple extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $archivos;

    public function __construct(array $archivos, $user)
    {
        $this->archivos = $archivos;
        $this->user = $user;
    }

    public function build()
    {
        $correo = $this->markdown('mails.reporte_multiple')
                       ->subject('📊 Reporte Automático')
                       ->with(['user' => $this->user]);

        foreach ($this->archivos as $archivo) {
            $correo->attachData($archivo['pdf'], $archivo['nombre'], [
                'mime' => 'application/pdf',
            ]);
        }

        return $correo;
    }
}
