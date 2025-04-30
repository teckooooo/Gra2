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
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;



Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

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
    Route::delete('/usuarios/{usuario}', [UserController::class, 'destroy'])->name('usuarios.destroy');
    Route::put('/usuarios/{usuario}/rol', [UserController::class, 'updateRol'])->name('usuarios.updateRol');
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::put('/usuarios/{user}', [UserController::class, 'update']);
    Route::delete('/usuarios/{user}', [UserController::class, 'destroy']);
    Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);


    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    // Permisos
    Route::get('/permisos', [PermisoController::class, 'index'])->name('permisos.index');
    Route::get('/roles/{role}/permisos', [PermisoController::class, 'getPermisosPorRol'])->name('roles.permisos');
    Route::get('/roles/{role}/permisos', [PermisoController::class, 'getPermisosPorRol']);
    Route::post('/roles/{role}/permisos', [PermisoController::class, 'asignarPermisos'])->name('roles.asignarPermisos');
    Route::post('/roles/{role}/permisos', [PermisoController::class, 'asignarPermisos']);

    //Base de datos
    Route::post('/importar-excel', [ImportarExcelController::class, 'importar']);

});
Route::get('/canales', function () {
    // Obtener los datos desde la base de datos
    $datos = DB::table('sheet_canales')->get();
    return Inertia::render('Canales', [
        'datos' => $datos,
    ]);

})->middleware(['auth', 'verified'])->name('canales');
Route::post('/canales', [CanalesController::class, 'store'])->name('canales.store');
Route::put('/canales/{id}', [CanalesController::class, 'update'])->name('canales.update');
Route::delete('/canales/{id}', [CanalesController::class, 'destroy'])->name('canales.destroy');

Route::get('/grilla/{zona}', [GrillaCanalesController::class, 'show'])->name('grilla.zona');
Route::put('/grilla/{zona}/{id}', [GrillaCanalesController::class, 'update'])->name('grilla.zona.update');
Route::post('/grilla/{zona}/store', [GrillaCanalesController::class, 'store'])->name('grilla.zona.store');


Route::get('/comercial', function () {
    return Inertia::render('comercial');
})->middleware(['auth', 'verified'])->name('nueva.vista');

Route::get('/reportesCanal', function () {
    return Inertia::render('reportesCanal');
})->middleware(['auth', 'verified'])->name('reportesCanal');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/reportes/cablecolor/{zona}', [ReportesCableColorController::class, 'obtenerDatos'])->name('reporte.cablecolor');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/reportes/cablecolor/puerto_natales', [ReportesCableColorController::class, 'puertoNatales'])->name('reportes.puerto_natales');
    Route::get('/reportes/cablecolor/punta_arenas', [ReportesCableColorController::class, 'puntaArenas'])->name('reportes.punta_arenas');
});

Route::get('/reportes/general/{tipo}', [ReportesCableColorController::class, 'obtenerReporteGeneral']);
Route::get('/reportes/anios-disponibles/{tipo}', [ReportesCableColorController::class, 'obtenerAniosDisponibles']);

Route::get('/reportes/general/cablecolor', [ReportesCableColorController::class, 'obtenerReporteGeneral'])->name('reportes.general.cablecolor')->defaults('tipo', 'cablecolor');

Route::get('/reportes/general/tvred', [ReportesCableColorController::class, 'obtenerReporteGeneral'])->name('reportes.general.tvred')->defaults('tipo', 'tvred');


Route::get('/reportesComercial', function () {
    return Inertia::render('reportesComercial');
})->middleware(['auth', 'verified'])->name('reportesComercial');

Route::get('/configuracion', function () {
    return Inertia::render('configuracion');
})->middleware(['auth'])->name('configuracion');

require __DIR__.'/auth.php';