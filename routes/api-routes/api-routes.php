<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectAuthenticatedUsers;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Http\Controllers\StoreController;
use App\Http\Middleware\ShareAuthData;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Middleware\AdminMiddleware;
use App\Models\RemoteConfig;
use App\Http\Controllers\StoreDataController;
use App\Http\Controllers\OpenAIService;
use App\Http\Controllers\ApiKeyController;
// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class])->group(function () {
    Route::get('/api/stores/sync-data', [StoreDataController::class, 'getStoreData']);
    Route::post('/api/verify-store-token', [StoreController::class, 'verifyToken']);
    Route::delete('/api/stores/{domain}', [StoreController::class, 'disconnect']);
    Route::post('/api/sync', [StoreDataController::class, 'runSync']);
    Route::post('/api/openai/store-token', [OpenAIService::class, 'storeToken']);
    Route::get('/api/store-logs/{store_id}', [StoreDataController::class, 'getStoreLogs']);
    Route::post('/logout', function () {
        // Clear all session data
        Session::flush();
        Session::regenerate(true); // Force session regeneration
        // Return JSON response
        return response()->json(['message' => 'Logged out successfully']);
    })->name('logout');

    Route::post('/auth/refresh-token', function (Request $request) {
        $token = $request->input('token');
        Session::put('firebase_token', $token);
        return response()->json(['message' => 'Token refreshed']);
    });

    Route::post('/api/apikeys', [ApiKeyController::class, 'store']);
    Route::delete('/api/apikeys/{id}', [ApiKeyController::class, 'destroy']);
});