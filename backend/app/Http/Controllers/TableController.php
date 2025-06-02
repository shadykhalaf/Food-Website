<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TableController extends Controller
{
    /**
     * Display a listing of all available tables.
     */
    public function index()
    {
        try {
            $tables = Table::where('status', 'available')->get();
            return response()->json($tables);
        } catch (\Exception $e) {
            Log::error('Error in TableController@index: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching tables'], 500);
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
                'number_of_guests' => 'required|integer|min:1',
                'email' => 'required|email|exists:users,email'
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
            Log::error('Error in TableController@checkAvailability: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error checking availability: ' . $e->getMessage()
            ], 500);
        }
    }
} 
