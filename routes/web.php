<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
});

Route::get('/comercial', function () {
    return Inertia::render('comercial');
})->middleware(['auth', 'verified'])->name('nueva.vista');

Route::get('/reportesCanal', function () {
    return Inertia::render('reportesCanal');
})->middleware(['auth', 'verified'])->name('reportesCanal');

Route::get('/reportesComercial', function () {
    return Inertia::render('reportesComercial');
})->middleware(['auth', 'verified'])->name('reportesComercial');

Route::get('/configuracion', function () {
    return Inertia::render('configuracion');
})->middleware(['auth'])->name('configuracion');








require __DIR__.'/auth.php';
