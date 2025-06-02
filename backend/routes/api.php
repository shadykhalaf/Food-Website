<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// Public routes
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Public table routes - these can remain public for viewing available tables
Route::get('/tables', [TableController::class, 'index']);
Route::post('/tables/check-availability', [TableController::class, 'checkAvailability']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::get('/profile/bookings', [ProfileController::class, 'bookings']);
    Route::get('/profile/orders', [ProfileController::class, 'orders']);
    Route::get('/profile/reviews', [ProfileController::class, 'reviews']);
    Route::delete('/profile/image', [ProfileController::class, 'deleteProfileImage']);
    
    // Booking routes - all booking operations require authentication
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/bookings', [AdminController::class, 'bookings']);
        Route::put('/bookings/{booking}/status', [AdminController::class, 'updateBookingStatus']);
        Route::get('/menu-items', [AdminController::class, 'menuItems']);
        Route::post('/menu-items', [AdminController::class, 'storeMenuItem']);
        Route::delete('/menu-items/{menuItem}', [AdminController::class, 'deleteMenuItem']);
    });
});

// Protected booking routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
});

// Table routes - public
Route::get('/tables', [TableController::class, 'index']);
Route::post('/tables/check-availability', [TableController::class, 'checkAvailability']);















