<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ArticleEmbedding extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'articleembeddings';
    protected $table = 'articleembeddings';

    protected $fillable = [
        'store_id',
        'shopify_id',
        'embedding',
        'title',
        'content',
        'url',
        'imageUrl',
        'publishedAt',
        'error',
        'skipped'
    ];

    protected $casts = [
        'embedding' => 'array',
        'publishedAt' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 