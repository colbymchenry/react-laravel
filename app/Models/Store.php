<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Store extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'stores';
    
    protected $fillable = [
        'user_uid',
        'store_url',
        'access_token',
        'name',
        'email',
        'domain',
        'shop_owner'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
} 