<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Display a listing of the bookings for the authenticated user.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $bookings = Booking::where('user_id', $user->id)
                ->with('table')
                ->orderBy('booking_date', 'desc')
                ->get();
            
            return response()->json($bookings);
        } catch (\Exception $e) {
            Log::error('Error in BookingController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching bookings'], 500);
        }
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'table_id' => 'required|exists:tables,id',
                'booking_date' => 'required|date',
                'booking_time' => 'required',
                'number_of_guests' => 'required|integer|min:1',
                'special_requests' => 'nullable|string',
                'email' => 'required|email|exists:users,email'
            ]);

            // Find the user by email
            $user = User::where('email', $validated['email'])->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'User with this email not found'
                ], 404);
            }

            $booking = Booking::create([
                'user_id' => $user->id,
                'table_id' => $validated['table_id'],
                'booking_date' => $validated['booking_date'],
                'booking_time' => $validated['booking_time'],
                'number_of_guests' => $validated['number_of_guests'],
                'special_requests' => $validated['special_requests'] ?? null,
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Booking created successfully!',
                'booking' => $booking->load('table')
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in BookingController@store: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        try {
            // Check if the booking belongs to the authenticated user
            if (Auth::id() !== $booking->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            return response()->json($booking->load('table'));
        } catch (\Exception $e) {
            Log::error('Error in BookingController@show: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching booking details'], 500);
        }
    }

    /**
     * Update the specified booking in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        try {
            // Check if the booking belongs to the authenticated user
            if (Auth::id() !== $booking->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $validated = $request->validate([
                'booking_date' => 'required|date',
                'booking_time' => 'required',
                'number_of_guests' => 'required|integer|min:1',
                'special_requests' => 'nullable|string'
            ]);

            $booking->update($validated);
            return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking]);
        } catch (\Exception $e) {
            Log::error('Error in BookingController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating booking'], 500);
        }
    }

    /**
     * Remove the specified booking from storage.
     */
    public function destroy(Booking $booking)
    {
        try {
            // Check if the booking belongs to the authenticated user
            if (Auth::id() !== $booking->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $booking->delete();
            return response()->json(['message' => 'Booking cancelled successfully']);
        } catch (\Exception $e) {
            Log::error('Error in BookingController@destroy: ' . $e->getMessage());
            return response()->json(['message' => 'Error cancelling booking'], 500);
        }
    }

    /**
     * Check availability of tables for a specific date and time.
     */
    public function checkAvailability(Request $request)
    {
        try {
            $validated = $request->validate([
                'booking_date' => 'required|date',
                'booking_time' => 'required',
                'number_of_guests' => 'required|integer|min:1'
            ]);

            // Find tables that can accommodate the number of guests
            $tables = Table::where('capacity', '>=', $validated['number_of_guests'])
                ->where('status', 'available')
                ->get();

            // Check which tables are already booked for the requested time
            $bookedTableIds = Booking::where('booking_date', $validated['booking_date'])
                ->where('booking_time', $validated['booking_time'])
                ->where('status', '!=', 'cancelled')
                ->pluck('table_id')
                ->toArray();

            // Filter out booked tables
            $availableTables = $tables->filter(function($table) use ($bookedTableIds) {
                return !in_array($table->id, $bookedTableIds);
            })->values();

            return response()->json([
                'available' => $availableTables->count() > 0,
                'tables' => $availableTables
            ]);
        } catch (\Exception $e) {
            Log::error('Error in BookingController@checkAvailability: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error checking availability: ' . $e->getMessage()
            ], 500);
        }
    }
}
