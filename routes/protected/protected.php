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
Route::middleware(['web', VerifyFirebaseToken::class, ShareAuthData::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/Dashboard', [
            'sync_data' => Inertia::defer(fn () => SyncData::all()),
        ]);
    })->name('dashboard');

    Route::get('/dashboard/stores', function () {
        return inertia('dashboard/Stores');
    })->name('dashboard.stores');

    // Add this with your other routes
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
});