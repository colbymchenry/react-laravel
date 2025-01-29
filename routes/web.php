<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectAuthenticatedUsers;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Http\Controllers\StoreController;
use App\Http\Middleware\ShareAuthData;

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
        return inertia('Dashboard');
    })->name('dashboard');

    Route::post('/api/verify-store-token', [StoreController::class, 'verifyToken']);
});

// Add this with your other routes
Route::post('/logout', function () {
    Session::flush();
    return redirect()->route('login');
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
        
        return redirect()->route('dashboard');
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