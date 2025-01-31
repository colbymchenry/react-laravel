<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class SyncData extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'sync_data';
    
    protected $fillable = [
        'store_id',
        'type',
        'shopify_id',
        'synced_at',
        'sync_status',
        'sync_error',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (!in_array($model->type, ['product', 'article'])) {
                throw new \InvalidArgumentException('Type must be either "product" or "article"');
            }
        });
    }
} 