<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MongoDB\Client;

class CreateSessionIndexes extends Command
{
    protected $signature = 'session:create-indexes';
    protected $description = 'Create indexes for MongoDB session storage';

    public function handle()
    {
        $client = new Client(env('MONGODB_URI'));
        $collection = $client->selectDatabase(env('MONGODB_DATABASE'))->sessions;

        // Create TTL index
        $collection->createIndex(
            ['last_activity' => 1],
            [
                'expireAfterSeconds' => config('session.lifetime', 120) * 60,
                'background' => true
            ]
        );

        $this->info('Session indexes created successfully.');
    }
} 