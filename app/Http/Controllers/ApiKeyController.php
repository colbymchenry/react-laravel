<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ApiKeyController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'api_key' => 'required|string'
        ]);

        $userUid = Session::get('firebase_user.uid');

        if (ApiKey::where('name', $request->name)->where('user_id', $userUid)->exists()) {
            return response()->json(['message' => 'API key name already exists'], 400);
        }

        if ($request->type === 'openai') {
            $openaiService = new OpenAIService();
            // Test the API key before storing
            try {
                $openaiService->testApiKey($request->api_key);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Invalid API key: ' . $e->getMessage()], 400);
            }
        }
        
        ApiKey::create([
            'user_id' => $userUid,
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'api_key' => $request->api_key,
        ]);

        return response()->json(['message' => 'API key added successfully']);
    }

    public function destroy($id)
    {
        try {
            $apiKey = ApiKey::findOrFail($id);
            
            // Check if user owns the API key
            if ($apiKey->user_id !== Session::get('firebase_user.uid')) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $apiKey->delete();
            return response()->json(['message' => 'API key deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete API key'], 500);
        }
    }
} 