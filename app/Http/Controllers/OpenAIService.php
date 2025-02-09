<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\ProductEmbedding;
use App\Models\ArticleEmbedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use App\Models\ApiKey;

class OpenAIService extends Controller
{
    public function storeToken(Request $request)
    {
        $token = $request->input('token');
        
        // Test the API key before storing
        try {
            $this->testApiKey($token);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid API key: ' . $e->getMessage()], 400);
        }
        
        $userUid = Session::get('firebase_user.uid');
        ApiKey::create([
            'user_id' => $userUid,
            'api_key' => $token,
            'type' => 'openai',
            'name' => 'OpenAI API Key',
            'description' => 'Your first OpenAI API key',
        ]);

        return response()->json(['message' => 'API key has been saved!'], 200);
    }

    public function testApiKey($apiKey)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => 'Hello world'],
            ],
            'max_tokens' => 50
        ]);

        if (!$response->successful()) {
            throw new \Exception($response->json('error.message') ?? 'Unknown error occurred');
        }

        return true;
    }
} 