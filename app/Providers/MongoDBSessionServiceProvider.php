<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Session;
use App\Services\MongoDBSessionHandler;

class MongoDBSessionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Session::extend('mongodb', function ($app) {
            return new MongoDBSessionHandler();
        });
    }
}