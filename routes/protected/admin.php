<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectAuthenticatedUsers;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Http\Controllers\StoreController;
use App\Http\Middleware\ShareAuthData;
use App\Http\Controllers\SyncDataController;
use App\Models\SyncData;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Middleware\AdminMiddleware;
use App\Models\RemoteConfig;

// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class, ShareAuthData::class, AdminMiddleware::class])->group(function () {
    Route::get('/dashboard/admin', function () {
        return Inertia::render('dashboard/admin/Admin', [
            'remoteConfig' => Inertia::defer(fn () => RemoteConfig::first()),
        ]);
    })->name('dashboard.admin');
});
