<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class StoreController extends Controller
{
    public function verifyToken(Request $request)
    {
        $request->validate([
            'storeUrl' => 'required|string',
            'token' => 'required|string|starts_with:shpat_'
        ]);

        try {
            // Verify token with Shopify
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $request->token
            ])->get("https://{$request->storeUrl}.myshopify.com/admin/api/2024-01/shop.json");

            if (!$response->successful()) {
                return response()->json(['error' => 'Invalid token'], 400);
            }

            $shopData = $response->json()['shop'];
            
            // Get user_uid from session
            $userUid = Session::get('firebase_user.uid');
            
            // Create or update store
            $store = Store::updateOrCreate(
                ['domain' => $shopData['domain']],
                [
                    'user_uid' => $userUid,
                    'store_url' => $request->storeUrl,
                    'access_token' => $request->token,
                    'name' => $shopData['name'],
                    'email' => $shopData['email'],
                    'domain' => $shopData['domain'],
                    'shop_owner' => $shopData['shop_owner']
                ]
            );

            return response()->json(['store' => $store]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to verify token'], 500);
        }
    }
} 