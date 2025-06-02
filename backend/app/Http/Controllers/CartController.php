<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function show()
    {
        $cart = Cart::with('items.menuItem')
            ->where('user_id', auth()->id())
            ->first();

        return view('cart.show', compact('cart'));
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            DB::beginTransaction();

            $menuItem = MenuItem::findOrFail($request->menu_item_id);

            if (!$menuItem->is_available) {
                return back()->with('error', 'This item is currently not available.');
            }

            $cart = Cart::firstOrCreate(
                ['user_id' => auth()->id()],
                ['total_amount' => 0]
            );

            $cartItem = $cart->items()->where('menu_item_id', $request->menu_item_id)->first();

            if ($cartItem) {
                $cartItem->update([
                    'quantity' => $cartItem->quantity + $request->quantity,
                    'price' => $menuItem->price
                ]);
            } else {
                $cart->items()->create([
                    'menu_item_id' => $request->menu_item_id,
                    'quantity' => $request->quantity,
                    'price' => $menuItem->price
                ]);
            }

            $this->updateCartTotal($cart);

            DB::commit();

            return back()->with('success', 'Item added to cart successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to add item to cart. Please try again.');
        }
    }

    public function updateItem(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            DB::beginTransaction();

            $cartItem->update([
                'quantity' => $request->quantity
            ]);

            $this->updateCartTotal($cartItem->cart);

            DB::commit();

            return back()->with('success', 'Cart updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update cart. Please try again.');
        }
    }

    public function removeItem(CartItem $cartItem)
    {
        try {
            DB::beginTransaction();

            $cart = $cartItem->cart;
            $cartItem->delete();

            $this->updateCartTotal($cart);

            DB::commit();

            return back()->with('success', 'Item removed from cart successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to remove item from cart. Please try again.');
        }
    }

    public function clear()
    {
        try {
            DB::beginTransaction();

            $cart = Cart::where('user_id', auth()->id())->first();
            
            if ($cart) {
                $cart->items()->delete();
                $cart->delete();
            }

            DB::commit();

            return back()->with('success', 'Cart cleared successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to clear cart. Please try again.');
        }
    }

    protected function updateCartTotal(Cart $cart)
    {
        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        $cart->update(['total_amount' => $total]);
    }
} 