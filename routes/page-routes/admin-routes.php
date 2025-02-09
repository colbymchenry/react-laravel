<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\VerifyFirebaseToken;
use App\Http\Middleware\ShareAuthData;
use Inertia\Inertia;
use App\Models\RemoteConfig;
use App\Http\Middleware\AdminMiddleware;

// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class, ShareAuthData::class, AdminMiddleware::class])->group(function () {
    Route::get('/dashboard/admin', function () {
        return Inertia::render('dashboard/admin/index', [
            'remoteConfig' => Inertia::defer(fn () => RemoteConfig::first()),
        ]);
    })->name('dashboard.admin');
});
