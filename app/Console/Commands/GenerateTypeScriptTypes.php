<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ReflectionClass;

class GenerateTypeScriptTypes extends Command
{
    protected $signature = 'generate:types';
    protected $description = 'Generate TypeScript types from Laravel models';

    public function handle()
    {
        $models = $this->getModels();
        $types = [];

        foreach ($models as $model) {
            $modelInstance = new $model();
            $fillable = $modelInstance->getFillable();
            $casts = $modelInstance->getCasts();

            $properties = [];
            foreach ($fillable as $field) {
                $type = $this->getTypeScriptType($field, $casts);
                $properties[] = "    {$field}: {$type};";
            }

            // Always include id, created_at, and updated_at for MongoDB
            $properties[] = "    _id: string;";
            $properties[] = "    created_at: string;";
            $properties[] = "    updated_at: string;";

            $modelName = class_basename($model);
            $types[] = "export interface {$modelName} {";
            $types = array_merge($types, $properties);
            $types[] = "}";
            $types[] = "";
        }

        $output = "// This file is auto-generated. Do not edit manually.\n\n";
        $output .= implode("\n", $types);

        File::put(base_path('resources/js/types/models.ts'), $output);
        $this->info('TypeScript types generated successfully!');
    }

    private function getModels(): array
    {
        $modelFiles = File::files(app_path('Models'));
        $models = [];

        foreach ($modelFiles as $file) {
            $className = 'App\\Models\\' . pathinfo($file->getFilename(), PATHINFO_FILENAME);
            if (class_exists($className)) {
                $models[] = $className;
            }
        }

        return $models;
    }

    private function getTypeScriptType(string $field, array $casts): string
    {
        if (isset($casts[$field])) {
            return match ($casts[$field]) {
                'integer', 'int' => 'number',
                'float', 'double', 'decimal' => 'number',
                'boolean', 'bool' => 'boolean',
                'array', 'json', 'collection' => 'any[]',
                'datetime', 'date' => 'string',
                default => 'string',
            };
        }

        // Default type mappings based on common field names
        return match (true) {
            str_contains($field, '_at') => 'string', // Timestamps
            str_contains($field, '_id') => 'string', // IDs
            str_contains($field, 'is_') => 'boolean', // Booleans
            str_contains($field, 'count') => 'number', // Counts
            default => 'string',
        };
    }
} 