<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialController;

// Social authentication routes
Route::get('auth/{provider}', [SocialController::class, 'redirect']);
Route::get('auth/{provider}/callback', [SocialController::class, 'callback']);

// Authentication routes
require __DIR__.'/auth.php';

// Catch-all route for the frontend
Route::get('/{any}', function () {
    return redirect()->away('http://localhost:5173');
})->where('any', '.*');

