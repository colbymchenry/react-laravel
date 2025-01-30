<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;

class RedirectAuthenticatedUsers
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? Session::get('firebase_token');

        if ($token) {
            try {
                $auth = Firebase::auth();
                $auth->verifyIdToken($token);
                
                // If we get here, token is valid and user is authenticated
                // Redirect to dashboard if trying to access auth pages
                return redirect()->route('dashboard');
            } catch (\Exception $e) {
                // If token is invalid, clear the session
                Session::forget('firebase_token');
                Session::forget('firebase_user');
            }
        }

        return $next($request);
    }
} 