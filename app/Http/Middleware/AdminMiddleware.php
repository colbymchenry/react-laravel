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
            $auth = Firebase::auth();
            $sessionUser = Session::get('firebase_user');
            $user = User::where('uid', $sessionUser['uid'])->first()->makeHidden('uid');
            
            // redirect to dashboard if user is not admin and on admin route
            if (in_array($request->path(), $this->authRoutes) && !$user->admin) {
                return redirect()->route('dashboard');
            }
        } else {
            \Log::info('No token found');
        }

        return $next($request);
    }
}