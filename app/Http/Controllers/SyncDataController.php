<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\SyncData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SyncDataController extends Controller
{
    public function getStoreSyncData()
    {
        try {
            $userUid = Session::get('firebase_user.uid');
            
            // Get all stores for the user
            $stores = Store::where('user_uid', $userUid)->get();
            
            // Get sync data for all stores
            $result = $stores->map(function ($store) {
                $syncData = SyncData::where('store_id', $store->_id)
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->groupBy('type')
                    ->map(function ($items) {
                        return [
                            'total' => $items->count(),
                            'latest' => $items->first(),
                            'error_count' => $items->where('sync_error', '!=', '')->count()
                        ];
                    });

                return [
                    'store' => $store->makeHidden(['access_token', 'user_uid']),
                    'sync_data' => [
                        'product' => $syncData['product'] ?? null,
                        'article' => $syncData['article'] ?? null
                    ]
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sync data'], 500);
        }
    }
} 