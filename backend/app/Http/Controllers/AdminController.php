<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            $stats = [
                'users_count' => User::count(),
                'bookings_count' => Booking::count(),
                'menu_items_count' => MenuItem::count(),
            ];
            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Admin dashboard error: ' . $e->getMessage());
            return response()->json(['message' => 'Error loading dashboard data'], 500);
        }
    }

    public function users()
    {
        try {
            $users = User::all();
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Admin users error: ' . $e->getMessage());
            return response()->json(['message' => 'Error loading users data'], 500);
        }
    }

    public function bookings()
    {
        try {
            $bookings = Booking::with('user')->get();
            return response()->json($bookings);
        } catch (\Exception $e) {
            Log::error('Admin bookings error: ' . $e->getMessage());
            return response()->json(['message' => 'Error loading bookings data'], 500);
        }
    }

    public function updateBookingStatus(Request $request, Booking $booking)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:confirmed,cancelled'
            ]);
            
            $booking->status = $validated['status'];
            $booking->save();
            
            // Here you would typically send a notification to the user
            // $booking->user->notify(new BookingStatusChanged($booking));
            
            return response()->json([
                'message' => 'Booking status updated successfully',
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            Log::error('Admin update booking status error: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating booking status'], 500);
        }
    }

    public function menuItems()
    {
        try {
            $menuItems = MenuItem::all();
            return response()->json($menuItems);
        } catch (\Exception $e) {
            Log::error('Admin menu items error: ' . $e->getMessage());
            return response()->json(['message' => 'Error loading menu items data'], 500);
        }
    }

    public function storeMenuItem(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'is_available' => 'boolean'
            ]);
            
            $menuItem = MenuItem::create($validated);
            
            return response()->json([
                'message' => 'Menu item created successfully',
                'menuItem' => $menuItem
            ], 201);
        } catch (\Exception $e) {
            Log::error('Admin store menu item error: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating menu item'], 500);
        }
    }

    public function deleteMenuItem(MenuItem $menuItem)
    {
        try {
            $menuItem->delete();
            return response()->json(['message' => 'Menu item deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Admin delete menu item error: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting menu item'], 500);
        }
    }
}
