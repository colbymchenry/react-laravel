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

require __DIR__ . '/admin.php';

// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class])->group(function () {
    Route::get('/api/stores/sync-data', [SyncDataController::class, 'getStoreSyncData']);
    Route::post('/api/verify-store-token', [StoreController::class, 'verifyToken']);
    Route::delete('/api/stores/{domain}', [StoreController::class, 'disconnect']);
});