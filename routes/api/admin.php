<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectAuthenticatedUsers;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Http\Middleware\ShareAuthData;
use App\Http\Controllers\SyncDataController;
use App\Models\SyncData;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Middleware\AdminMiddleware;
use App\Models\RemoteConfig;

// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class, AdminMiddleware::class])->group(function () {
    Route::post('/api/update-remote-config', function (Request $request) {
        $validated = $request->validate([
            'openai_api_key' => 'required|string',
            'openai_embedding_model' => 'required|string',
            'openai_model' => 'required|string'
        ]);

        $config = RemoteConfig::first() ?? new RemoteConfig();
        $config->fill($validated);
        $config->save();

        return back()->with('success', 'Config updated successfully');
    });
});