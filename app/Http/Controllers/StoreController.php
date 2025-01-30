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
            $baseUrl = "https://{$request->storeUrl}.myshopify.com/admin/api/2024-01";
            $headers = ['X-Shopify-Access-Token' => $request->token];
            $accessChecks = [];

            // Check shop access (basic info)
            $shopResponse = Http::withHeaders($headers)->get("$baseUrl/shop.json");
            if (!$shopResponse->successful()) {
                return response()->json(['error' => 'Invalid token'], 400);
            }
            $shopData = $shopResponse->json()['shop'];
            
            // Check orders access
            $ordersResponse = Http::withHeaders($headers)->get("$baseUrl/orders.json?limit=1");
            $accessChecks['orders'] = $ordersResponse->successful();

            // Check customers access
            $customersResponse = Http::withHeaders($headers)->get("$baseUrl/customers.json?limit=1");
            $accessChecks['customers'] = $customersResponse->successful();

            // Check products access
            $productsResponse = Http::withHeaders($headers)->get("$baseUrl/products.json?limit=1");
            $accessChecks['products'] = $productsResponse->successful();

            // Check blogs access
            $blogsResponse = Http::withHeaders($headers)->get("$baseUrl/blogs.json?limit=1");
            $accessChecks['blogs'] = $blogsResponse->successful();

            // Check articles access (using first blog if available)
            if ($blogsResponse->successful() && !empty($blogsResponse->json()['blogs'])) {
                $firstBlogId = $blogsResponse->json()['blogs'][0]['id'];
                $articlesResponse = Http::withHeaders($headers)->get("$baseUrl/blogs/{$firstBlogId}/articles.json?limit=1");
                $accessChecks['articles'] = $articlesResponse->successful();
            } else {
                $accessChecks['articles'] = false;
            }

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

            return response()->json([
                'store' => $store,
                'permissions' => $accessChecks
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to verify token'], 500);
        }
    }

    public function disconnect(Request $request, $domain)
    {
        try {
            $store = Store::where('domain', $domain)->first();
            
            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            // Check if user owns the store
            if ($store->user_uid !== Session::get('firebase_user.uid')) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $store->delete();
            return response()->json(['message' => 'Store disconnected successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to disconnect store'], 500);
        }
    }
} 