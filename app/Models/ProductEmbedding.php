<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ProductEmbedding extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'productembeddings';
    protected $table = 'productembeddings';
    
    protected $fillable = [
        'store_id',
        'shopify_id',
        'embedding',
        'title',
        'description',
        'price',
        'url',
        'imageUrl',
        'error',
        'skipped'
    ];

    protected $casts = [
        'embedding' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 