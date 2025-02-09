<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectAuthenticatedUsers;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Http\Controllers\StoreController;
use App\Http\Middleware\ShareAuthData;
use App\Http\Controllers\StoreDataController;
use App\Models\SyncData;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Middleware\AdminMiddleware;
use App\Models\RemoteConfig;
use App\Http\Middleware\RedirectOpenAIApiKey;
use App\Models\ApiKey;
// Protected routes
Route::middleware(['web', VerifyFirebaseToken::class, RedirectOpenAIApiKey::class, ShareAuthData::class])->group(function () {
    Route::get('/dashboard', function () {
        $storeDataController = new StoreDataController();
        return Inertia::render('dashboard/index', [
            'syncData' => Inertia::defer(fn () => $storeDataController->getStoreData(false)),
        ]);
    })->name('dashboard');

    Route::get('/dashboard/stores', function () {
        return inertia('dashboard/stores/index');
    })->name('dashboard.stores');

    Route::get('/dashboard/apikeys', function () {
        $userUid = Session::get('firebase_user.uid');
        return Inertia::render('dashboard/apikeys/index', [
            'apikeys' => ApiKey::where('user_id', $userUid)->get()->makeHidden('api_key'),
        ]);
    })->name('dashboard.apikeys');
});