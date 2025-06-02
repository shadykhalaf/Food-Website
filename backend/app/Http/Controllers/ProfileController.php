<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function index()
    {
        try {
            $user = Auth::user();
            return response()->json($user);
        } catch (\Exception $e) {
            Log::error('Error fetching profile: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching profile data'], 500);
        }
    }

    /**
     * Update the user's profile
     */
    public function update(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'new_password' => 'nullable|string|min:8|confirmed',
            ]);

            if ($request->hasFile('profile_image')) {
                if ($user->profile_image) {
                    Storage::disk('public')->delete($user->profile_image);
                }
                $path = $request->file('profile_image')->store('profile-images', 'public');
                $validated['profile_image'] = $path;
            }

            if ($request->filled('new_password')) {
                $validated['password'] = Hash::make($request->new_password);
            }

            $user->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating profile: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating profile: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get the authenticated user's bookings
     */
    public function bookings()
    {
        try {
            $bookings = Auth::user()->bookings()
                ->with('table')
                ->latest()
                ->take(5)
                ->get();
            
            return response()->json($bookings);
        } catch (\Exception $e) {
            Log::error('Error fetching bookings: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching bookings: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get the authenticated user's orders
     */
    public function orders()
    {
        try {
            $orders = Auth::user()->orders()
                ->with('menuItems')
                ->latest()
                ->take(5)
                ->get();
                
            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('Error fetching orders: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching orders: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get the authenticated user's reviews
     */
    public function reviews()
    {
        try {
            $reviews = Auth::user()->reviews()
                ->with('menuItem')
                ->latest()
                ->take(5)
                ->get();
                
            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Error fetching reviews: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching reviews: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete the user's profile image
     */
    public function deleteProfileImage()
    {
        try {
            $user = Auth::user();
            
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
                $user->update(['profile_image' => null]);
            }

            return response()->json([
                'message' => 'Profile image removed successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error removing profile image: ' . $e->getMessage());
            return response()->json(['message' => 'Error removing profile image: ' . $e->getMessage()], 500);
        }
    }
} 
