<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectAuthenticatedUsers;
use App\Http\Middleware\VerifyFirebaseToken;

// Public routes with redirect for authenticated users
Route::middleware([RedirectAuthenticatedUsers::class])->group(function () {
    Route::get('/', function () {
        return inertia('Auth/Login');
    });

    Route::get('/login', function () {
        return inertia('Auth/Login');
    })->name('login');

    Route::get('/register', function () {
        return inertia('Auth/Register');
    })->name('register');
});

// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class])->group(function () {
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');
});
