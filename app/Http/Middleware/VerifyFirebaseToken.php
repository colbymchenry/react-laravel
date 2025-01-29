<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;

class VerifyFirebaseToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? Session::get('firebase_token');

        if (!$token) {
            Session::forget(['firebase_user', 'firebase_token']);
            return redirect()->route('login');
        }

        try {
            $auth = Firebase::auth();
            $verifiedIdToken = $auth->verifyIdToken($token);
            
            $uid = $verifiedIdToken->claims()->get('sub');
            $email = $verifiedIdToken->claims()->get('email');
            
            // Store both user info and token in session
            Session::put('firebase_user', [
                'uid' => $uid,
                'email' => $email
            ]);
            Session::put('firebase_token', $token);
            
            return $next($request);
        } catch (\Exception $e) {
            Session::forget(['firebase_user', 'firebase_token']);
            return redirect()->route('login');
        }
    }
} 