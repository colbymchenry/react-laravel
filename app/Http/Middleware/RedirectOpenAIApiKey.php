<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;
use App\Models\ApiKey;

class RedirectOpenAIApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? Session::get('firebase_token');

        if ($token) {
            $sessionUser = Session::get('firebase_user');
            $openAiKeyQuery = ApiKey::where('user_id', $sessionUser['uid'])->where('type', 'openai')->first();
            
            // redirect to guide if user does not have an openai api key
            if (!$openAiKeyQuery) {
                return redirect()->route('setup-openai');
            }
        } else {
            \Log::info('No token found');
        }

        return $next($request);
    }
}
