<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\ProductEmbedding;
use App\Models\ArticleEmbedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class StoreDataController extends Controller
{
    public function getStoreData(bool $insights = false)
    {
        try {
            $userUid = Session::get('firebase_user.uid');

            // Get all stores for the user
            $stores = Store::where('user_uid', $userUid)->get();

            // Get sync data for all stores
            $result = $stores->map(function ($store) use ($insights) {
                \Log::info('Store: ' . $store->id);
                // Get product embeddings data
                $productEmbeddings = ProductEmbedding::where('store_id', $store->id);
                $productCount = $productEmbeddings->count();

                $productEmbeddingsError = ProductEmbedding::where('store_id', $store->id)
                    ->where('error', '!=', null)
                    ->get()
                    ->map(function($item) {
                        return $item->makeHidden(['_id'])->getAttributes();
                    });
                $productCountError = $productEmbeddingsError->count();

                $productEmbeddingsSkipped = ProductEmbedding::where('store_id', $store->id)
                    ->where('skipped', '!=', null)
                    ->get()
                    ->map(function($item) {
                        return $item->makeHidden(['_id'])->getAttributes();
                    });
                $productCountSkipped = $productEmbeddingsSkipped->count();

                $productEmbeddingsSynced = $productCount - $productCountError - $productCountSkipped;

                // Get article embeddings data
                $articleEmbeddings = ArticleEmbedding::where('store_id', $store->id);
                $articleCount = $articleEmbeddings->count();

                $articleEmbeddingsError = ArticleEmbedding::where('store_id', $store->id)
                    ->where('error', '!=', null)
                    ->get()
                    ->map(function($item) {
                        return $item->makeHidden(['_id'])->getAttributes();
                    });
                $articleCountError = $articleEmbeddingsError->count();

                $articleEmbeddingsSkipped = ArticleEmbedding::where('store_id', $store->id)
                    ->where('skipped', '!=', null)
                    ->get()
                    ->map(function($item) {
                        return $item->makeHidden(['_id'])->getAttributes();
                    });
                $articleCountSkipped = $articleEmbeddingsSkipped->count();

                $articleEmbeddingsSynced = $articleCount - $articleCountError - $articleCountSkipped;

                $latestProduct = $productEmbeddings->latest()->first();
                $latestArticle = $articleEmbeddings->latest()->first();

                $syncData = [
                    'product' => [
                        'total' => $productCount,
                        'synced' => $productEmbeddingsSynced,
                        'latest' => $latestProduct ? $latestProduct->makeHidden(['embedding', 'description'])->toArray() : null,
                        'error_count' => $productCountError
                    ],
                    'article' => [
                        'total' => $articleCount,
                        'synced' => $articleEmbeddingsSynced,
                        'latest' => $latestArticle ? $latestArticle->makeHidden(['embedding', 'content'])->toArray() : null,
                        'error_count' => $articleCountError
                    ]
                ];

                if ($insights == true) {
                    $syncData['product']['errors'] = $productEmbeddingsError->all();
                    $syncData['product']['skipped'] = $productEmbeddingsSkipped->all();
                    $syncData['article']['errors'] = $articleEmbeddingsError->all();
                    $syncData['article']['skipped'] = $articleEmbeddingsSkipped->all();
                }

                return [
                    'store' => $store->makeHidden(['access_token', 'user_uid'])->toArray(),
                    'sync_data' => $syncData
                ];
            });

            \Log::info($result->toArray());

            // dd(gettype($result)); // This will show you the variable type
            return response()->json($result->toArray());
        } catch (\Exception $e) {
            \Log::error('Error in getStoreSyncData: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch sync data'], 500);
        }
    }

    public static function runSync(Request $request)
    {
        $storeId = $request->input('store_id');
        $store = Store::find($storeId);

        try {
            $gatewayUrl = env('GATEWAY_URL');

            \Log::info('Syncing store: ' . $storeId);
            \Log::info($gatewayUrl . '/stores/' . $storeId . '/sync');

            $response = Http::post($gatewayUrl . '/stores/' . $storeId . '/sync');

            if (!$response->successful()) {
                throw new \Exception('Failed to trigger sync: ' . $response->body());
            }

            return redirect()->back()->with('success', 'Sync triggered successfully');
        } catch (\Exception $e) {
            \Log::error('Sync error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getStoreLogs($store_id) {
        try {
            $store = Store::find($store_id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            $productEmbeddingsError = ProductEmbedding::where('store_id', $store->id)
                ->where('error', '!=', null)
                ->get()
                ->map(function($item) {
                    return $item->makeHidden(['_id'])->getAttributes();
                });
            $productEmbeddingsSkipped = ProductEmbedding::where('store_id', $store->id)
                ->where('skipped', '!=', null)
                ->get()
                ->map(function($item) {
                    return $item->makeHidden(['_id'])->getAttributes();
                });
            $articleEmbeddingsError = ArticleEmbedding::where('store_id', $store->id)
                ->where('error', '!=', null)
                ->get()
                ->map(function($item) {
                    return $item->makeHidden(['_id'])->getAttributes();
                });
            $articleEmbeddingsSkipped = ArticleEmbedding::where('store_id', $store->id)
                ->where('skipped', '!=', null)
                ->get()
                ->map(function($item) {
                    return $item->makeHidden(['_id'])->getAttributes();
                });

            return response()->json([
                'product' => [
                    'error' => $productEmbeddingsError->all(),
                    'skipped' => $productEmbeddingsSkipped->all()
                ],
                'article' => [
                    'error' => $articleEmbeddingsError->all(),
                    'skipped' => $articleEmbeddingsSkipped->all()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getStoreLogs: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch store logs'], 500);
        }
    }
}
