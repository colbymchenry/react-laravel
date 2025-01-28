<?php

namespace App\Services;

use MongoDB\Client;
use SessionHandlerInterface;

class MongoDBSessionHandler implements SessionHandlerInterface
{
    protected $collection;
    protected $lifetime;

    public function __construct()
    {
        $client = new Client(env('MONGODB_URI'));
        $database = $client->selectDatabase(env('MONGODB_DATABASE'));
        $this->collection = $database->sessions;
        $this->lifetime = config('session.lifetime', 120) * 60; // Convert minutes to seconds
    }

    public function open($path, $name): bool
    {
        return true;
    }

    public function close(): bool
    {
        return true;
    }

    public function read($id): string|false
    {
        $session = $this->collection->findOne(['_id' => $id]);
        
        if ($session && isset($session->last_activity) && 
            (time() - $session->last_activity) <= $this->lifetime) {
            return $session->payload ?? '';
        }

        return '';
    }

    public function write($id, $data): bool
    {
        $this->collection->updateOne(
            ['_id' => $id],
            [
                '$set' => [
                    'payload' => $data,
                    'last_activity' => time(),
                ]
            ],
            ['upsert' => true]
        );

        return true;
    }

    public function destroy($id): bool
    {
        $this->collection->deleteOne(['_id' => $id]);
        return true;
    }

    public function gc($max_lifetime): int|false
    {
        $result = $this->collection->deleteMany([
            'last_activity' => ['$lt' => time() - $max_lifetime]
        ]);

        return $result->getDeletedCount();
    }

    public function getAllActiveSessions(): array
    {
        $cursor = $this->collection->find([
            'last_activity' => ['$gt' => time() - $this->lifetime]
        ]);

        return iterator_to_array($cursor);
    }

    public function deleteAllSessions(): bool
    {
        $this->collection->deleteMany([]);
        return true;
    }

    public function touchSession($id): bool
    {
        $this->collection->updateOne(
            ['_id' => $id],
            ['$set' => ['last_activity' => time()]]
        );
        return true;
    }
}