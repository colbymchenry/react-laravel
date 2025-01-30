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
// Public routes with redirect for authenticated users
Route::middleware([RedirectAuthenticatedUsers::class])->group(function () {
    Route::get('/', function () {
        return redirect()->route('login');
    });

    Route::get('/login', function (Request $request) {
        return inertia('Login');
    })->name('login');
});

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

    Route::get('/api/stores/sync-data', [SyncDataController::class, 'getStoreSyncData']);
    Route::post('/api/verify-store-token', [StoreController::class, 'verifyToken']);
    Route::delete('/api/stores/{domain}', [StoreController::class, 'disconnect']);

    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::get('/dashboard/admin', function () {
            return Inertia::render('dashboard/admin/Admin');
        })->name('dashboard.admin');
    });
    
    
});

// Add this with your other routes
Route::post('/logout', function () {
    // Clear all session data
    Session::flush();
    
    // Return JSON response instead of redirect
    return redirect()->name('login');
})->name('logout');

// Add this with your other public routes
Route::post('/auth/callback', function (Request $request) {
    try {
        $token = $request->input('token');
        $auth = Firebase::auth();
        $verifiedIdToken = $auth->verifyIdToken($token);
        
        $uid = $verifiedIdToken->claims()->get('sub');
        $email = $verifiedIdToken->claims()->get('email');
        
        Session::put('firebase_user', [
            'uid' => $uid,
            'email' => $email
        ]);
        Session::put('firebase_token', $token);

        User::updateOrCreate(
            ['uid' => $uid], // Find by uid
            [
                'uid' => $uid,
                'admin' => true
            ]
        );
        
        return response()->json(['message' => 'Token refreshed']);
    } catch (\Exception $e) {
        return redirect()->route('login')->with('error', 'Invalid token');
    }
});

// Add this route for handling email links
Route::get('/auth/email-link', function (Request $request) {
    return inertia('EmailLinkHandler');
})->name('email-link-handler');

Route::post('/auth/refresh-token', function (Request $request) {
    $token = $request->input('token');
    Session::put('firebase_token', $token);
    return response()->json(['message' => 'Token refreshed']);
});