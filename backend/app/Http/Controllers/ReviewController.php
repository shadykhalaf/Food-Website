<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use App\Models\MenuItem;
use App\Notifications\NewReviewNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'menuItem'])
            ->latest()
            ->paginate(10);
        return view('reviews.index', compact('reviews'));
    }

    public function create(Order $order)
    {
        $order->load('menuItems');
        return view('reviews.create', compact('order'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'menu_item_id' => 'required|exists:menu_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10'
        ]);

        // Check if user has already reviewed this item for this order
        $existingReview = Review::where('order_id', $request->order_id)
            ->where('menu_item_id', $request->menu_item_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this item for this order.');
        }

        // Check if the order belongs to the user
        $order = Order::findOrFail($request->order_id);
        if ($order->user_id !== Auth::id()) {
            return back()->with('error', 'You can only review items from your own orders.');
        }

        // Check if the menu item was part of the order
        if (!$order->menuItems()->where('menu_items.id', $request->menu_item_id)->exists()) {
            return back()->with('error', 'This item was not part of your order.');
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'order_id' => $request->order_id,
            'menu_item_id' => $request->menu_item_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false
        ]);

        // Notify admin about new review
        $admin = User::where('is_admin', true)->first();
        if ($admin) {
            $admin->notify(new NewReviewNotification($review));
        }

        return redirect()->route('orders.show', $order)
            ->with('success', 'Review submitted successfully and is pending approval.');
    }

    public function approve(Review $review)
    {
        if (!Auth::user()->is_admin) {
            return back()->with('error', 'Only administrators can approve reviews.');
        }

        $review->update(['is_approved' => true]);

        return back()->with('success', 'Review approved successfully.');
    }

    public function reject(Review $review)
    {
        if (!Auth::user()->is_admin) {
            return back()->with('error', 'Only administrators can reject reviews.');
        }

        $review->delete();

        return back()->with('success', 'Review rejected and deleted successfully.');
    }

    public function destroy(Review $review)
    {
        if (Auth::id() !== $review->user_id && !Auth::user()->is_admin) {
            return back()->with('error', 'You can only delete your own reviews.');
        }

        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
} 