<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\CartItem;
use App\Notifications\OrderConfirmationNotification;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'menuItems'])
            ->latest()
            ->paginate(10);
        return view('orders.index', compact('orders'));
    }

    public function show(Order $order)
    {
        $order->load(['user', 'menuItems', 'reviews']);
        return view('orders.show', compact('order'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|exists:carts,id',
            'payment_method' => 'required|in:credit_card,cash,online',
            'delivery_address' => 'required_if:delivery_type,delivery',
            'special_instructions' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $cart = Cart::with('items.menuItem')->findOrFail($request->cart_id);
            
            $order = Order::create([
                'user_id' => auth()->id(),
                'total_amount' => $cart->total_amount,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'delivery_address' => $request->delivery_address,
                'special_instructions' => $request->special_instructions
            ]);

            foreach ($cart->items as $item) {
                $order->menuItems()->attach($item->menu_item_id, [
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ]);
            }

            // Send order confirmation notification
            auth()->user()->notify(new OrderConfirmationNotification($order));

            // Clear the cart
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return redirect()->route('orders.show', $order)
                ->with('success', 'Order placed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to place order. Please try again.');
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,ready,delivered,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        // Send status update notification
        $order->user->notify(new OrderStatusNotification($order));

        return back()->with('success', 'Order status updated successfully.');
    }

    public function updatePaymentStatus(Request $request, Order $order)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,paid,failed'
        ]);

        $order->update([
            'payment_status' => $request->payment_status
        ]);

        return back()->with('success', 'Payment status updated successfully.');
    }

    public function destroy(Order $order)
    {
        if ($order->status !== 'cancelled') {
            return back()->with('error', 'Only cancelled orders can be deleted.');
        }

        $order->menuItems()->detach();
        $order->delete();

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }
} 