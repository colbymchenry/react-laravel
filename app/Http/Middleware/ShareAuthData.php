<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Store;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
use App\Models\User;

class ShareAuthData
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = Session::get('firebase_user')) {
            // Share auth data with Inertia using the facade
            Inertia::share([
                'auth' => [
                    'user' => $user,
                    'token' => Session::get('firebase_token')
                ],
                'userData' => User::where('uid', $user['uid'])->first()->makeHidden('uid'),
                'stores' => Store::where('user_uid', $user['uid'])->get()->makeHidden('access_token')->makeHidden('user_uid')
            ]);
        }

        return $next($request);
    }
} 