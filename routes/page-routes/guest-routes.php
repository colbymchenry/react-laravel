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


// Public routes with redirect for authenticated users
Route::middleware(['web', RedirectAuthenticatedUsers::class])->group(function () {
    Route::get('/', function () {
        return redirect()->route('login');
    });

    Route::get('/login', function (Request $request) {
        return inertia('login/index');
    })->name('login');

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
        return inertia('email-link-handler/index');
    })->name('email-link-handler');
});
