<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'category_id',
        'is_available',
        'preparation_time',
    ];

    protected $casts = [
        'price' => 'float',
        'is_available' => 'boolean',
        'preparation_time' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}



