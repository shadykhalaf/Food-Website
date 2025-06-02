<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'table_id',
        'booking_date',
        'booking_time',
        'number_of_guests',
        'special_requests',
        'status',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'number_of_guests' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }
}







