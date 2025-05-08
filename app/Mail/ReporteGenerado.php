<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReporteGenerado extends Mailable
{
    use Queueable, SerializesModels;

    public $pdf;

    public function __construct($pdf)
    {
        $this->pdf = $pdf;
    }

    public function build()
    {
        return $this->subject('📊 Reporte automático')
            ->markdown('emails.reporte')
            ->attachData($this->pdf, 'reporte.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
