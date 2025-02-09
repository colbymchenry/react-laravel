<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ApiKey extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'apikeys';
    protected $table = 'apikeys';

    protected $fillable = [
        'api_key',
        'type',
        'user_id',
        'name',
        'description',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 