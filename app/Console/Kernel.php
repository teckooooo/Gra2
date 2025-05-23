<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
   protected function schedule(Schedule $schedule): void
{
    \Log::info('🕒 schedule() ejecutado');

    // TEST directo: este se debería ejecutar siempre
    $schedule->call(function () {
        \Log::info('✅ Scheduler funciona: prueba directa ejecutada');
    })->cron('* * * * *');

    // Comando real
    $schedule->command('reportes:enviar')
        ->cron('* * * * *')
        ->withoutOverlapping(false)
        ->evenInMaintenanceMode()
        ->runInBackground();
}


    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
