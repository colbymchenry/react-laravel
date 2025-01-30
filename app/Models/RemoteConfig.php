<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class RemoteConfig extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'remote_config';
    
    protected $fillable = [
        'openai_api_key',
        'openai_embedding_model',
        'openai_model'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
} 