<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\CanalesController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImportarExcelController;
use App\Http\Controllers\ReportesCableColorController;
use App\Http\Controllers\GrillaCanalesController;
use App\Http\Controllers\ComercialController;
use App\Http\Controllers\ReportesComercialController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

// Redirección raíz
Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Usuarios
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::put('/usuarios/{user}', [UserController::class, 'update'])->name('usuarios.update');
    Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('usuarios.destroy');
    Route::put('/usuarios/{usuario}/rol', [UserController::class, 'updateRol'])->name('usuarios.updateRol');

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    // Permisos
    Route::get('/permisos', [PermisoController::class, 'index'])->name('permisos.index');
    Route::get('/roles/{role}/permisos', [PermisoController::class, 'getPermisosPorRol'])->name('roles.permisos');
    Route::post('/roles/{role}/permisos', [PermisoController::class, 'asignarPermisos'])->name('roles.asignarPermisos');

    // Importación Excel
    Route::post('/importar-excel', [ImportarExcelController::class, 'importar']);

    // Comercial (vista inicial sin tipo)
    Route::get('/Comercial', function () {
        return Inertia::render('Comercial', [
            'tipo' => null,
            'registros' => [],
        ]);
    })->name('comercial');

    // Comercial dinámico
    Route::get('/comercial/{tipo}', [ComercialController::class, 'index'])->name('comercial.vista');
    Route::post('/comercial/{tipo}', [ComercialController::class, 'store'])->name('comercial.store');
    Route::put('/comercial/{tipo}/{id}', [ComercialController::class, 'update'])->name('comercial.update');

    // Canales
    Route::get('/canales', function () {
        $datos = DB::table('sheet_canales')->get();
        return Inertia::render('Canales', ['datos' => $datos]);
    })->name('canales');

    Route::post('/canales', [CanalesController::class, 'store'])->name('canales.store');
    Route::put('/canales/{id}', [CanalesController::class, 'update'])->name('canales.update');
    Route::delete('/canales/{id}', [CanalesController::class, 'destroy'])->name('canales.destroy');

    // Grilla Canal
    Route::get('/grilla/{zona}', [GrillaCanalesController::class, 'show'])->name('grilla.zona');
    Route::put('/grilla/{zona}/{id}', [GrillaCanalesController::class, 'update'])->name('grilla.zona.update');
    Route::post('/grilla/{zona}/store', [GrillaCanalesController::class, 'store'])->name('grilla.zona.store');

    // Reportes Canal
    Route::get('/reportesCanal', function () {
        return Inertia::render('reportesCanal');
    })->name('reportesCanal');

    Route::get('/reportes/cablecolor/{zona}', [ReportesCableColorController::class, 'obtenerDatos'])->name('reporte.cablecolor');
    Route::get('/reportes/cablecolor/puerto_natales', [ReportesCableColorController::class, 'puertoNatales'])->name('reportes.puerto_natales');
    Route::get('/reportes/cablecolor/punta_arenas', [ReportesCableColorController::class, 'puntaArenas'])->name('reportes.punta_arenas');

    Route::get('/reportes/general/{tipo}', [ReportesCableColorController::class, 'obtenerReporteGeneral']);
    Route::get('/reportes/anios-disponibles/{tipo}', [ReportesCableColorController::class, 'obtenerAniosDisponibles']);
    Route::get('/reportes/general/cablecolor', [ReportesCableColorController::class, 'obtenerReporteGeneral'])->name('reportes.general.cablecolor')->defaults('tipo', 'cablecolor');
    Route::get('/reportes/general/tvred', [ReportesCableColorController::class, 'obtenerReporteGeneral'])->name('reportes.general.tvred')->defaults('tipo', 'tvred');
    Route::get('/reportes/porcentaje-incidencias/{tipo}', [ReportesCableColorController::class, 'obtenerPorcentajeIncidencias']);

    // Reportes Comercial
    Route::get('/reportesComercial', function () {
        return Inertia::render('reportesComercial');
    })->name('reportesComercial');
    Route::middleware(['auth'])->group(function () {
        Route::get('/reportes-comercial/altas', [ReportesComercialController::class, 'altas']);
        Route::get('/reportes-comercial/bajas', [ReportesComercialController::class, 'bajas']);
        Route::get('/reportes-comercial/resumen', [ReportesComercialController::class, 'resumen']);
    });
    

    // Configuración
    Route::get('/configuracion', function () {
        return Inertia::render('configuracion');
    })->name('configuracion');

    Route::get('/reportes/general/{tipo}/pdf', [ReportesCableColorController::class, 'generarPDF']);
    Route::post('/reportes/general/{tipo}/pdf-con-graficos', [ReportesCableColorController::class, 'generarPDFconGraficos']);
    Route::post('/reportes/general/{tipo}/pdf-con-graficos', [ReportesCableColorController::class, 'generarPDF'])->name('reportes.pdf');
    Route::post('/reportes/general/{tipo}/pdf-con-graficos', [ReportesCableColorController::class, 'generarPDF'])->middleware('auth');
    Route::post('/reportesCanal/pdf/exportar', [ReportesCableColorController::class, 'exportarPDF'])->name('reportes.exportarPDF');

    Route::post('/reportesComercial/pdf/exportar', [ReportesComercialController::class, 'exportarPDF']);


});

require __DIR__.'/auth.php';
