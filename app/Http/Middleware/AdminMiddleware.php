<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class AdminMiddleware
{
    protected $authRoutes = [
        'dashboard/admin'
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? Session::get('firebase_token');

        if ($token) {
            try {
                $auth = Firebase::auth();
                $auth->verifyIdToken($token);
                $sessionUser = Session::get('firebase_user');
                $user = User::where('uid', $sessionUser['uid'])->first()->makeHidden('uid');
                
                // If we get here, token is valid and user is authenticated
                // Only redirect if on an auth route
                if (in_array($request->path(), $this->authRoutes) && !$user->admin) {
                    return redirect()->route('dashboard');
                }
            } catch (\Exception $e) {
               // If token is invalid, clear the session
               Session::forget('firebase_token');
               Session::forget('firebase_user');
            }
        } else {
            \Log::info('No token found');
        }

        return $next($request);
    }
}