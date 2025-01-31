<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;

class RedirectAuthenticatedUsers
{
    protected $guestRoutes = [
        'login',
        '/'
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? Session::get('firebase_token');

        if ($token) {
            // Only redirect if on an auth route
            if (in_array($request->path(), $this->guestRoutes)) {
                return redirect()->route('dashboard');
            }
        }

        return $next($request);
    }
}