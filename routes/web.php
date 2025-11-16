<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {

    // AUTH
    Route::prefix('auth')->group(function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');
        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');
        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    // SEMUA ROUTE YANG BUTUH LOGIN
    Route::middleware('check.auth')->group(function () {

        // Redirect root ke /todos
        Route::get('/', function() {
            return redirect()->route('todos.index');
        })->name('home');

        // TODOS
        Route::prefix('todos')->group(function () {
            Route::get('/', [TodoController::class, 'index'])->name('todos.index');
            Route::get('/create', [TodoController::class, 'create'])->name('todos.create');
            Route::post('/store', [TodoController::class, 'store'])->name('todos.store');
            Route::get('/{id}/edit', [TodoController::class, 'edit'])->name('todos.edit');
            Route::put('/{id}/update', [TodoController::class, 'update'])->name('todos.update');
            Route::delete('/{id}', [TodoController::class, 'destroy'])->name('todos.delete');
            Route::put('/{id}/toggle', [TodoController::class, 'toggle'])->name('todos.toggle');
        });

    });
});
