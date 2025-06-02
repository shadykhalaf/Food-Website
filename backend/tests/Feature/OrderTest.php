<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\MenuItem;
use App\Models\CartItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $menuItem;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->menuItem = MenuItem::factory()->create([
            'price' => 9.99
        ]);
    }

    public function test_user_can_create_order()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        // Add items to cart
        CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $orderData = [
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', $orderData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'user_id' => $this->user->id,
                    'delivery_address' => '123 Test St',
                    'phone_number' => '1234567890',
                    'payment_method' => 'credit_card',
                    'total_amount' => '19.98'
                ]
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'delivery_address' => '123 Test St',
            'status' => 'pending'
        ]);

        // Verify cart is cleared after order
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_user_cannot_create_order_with_empty_cart()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $orderData = [
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', $orderData);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Cart is empty'
            ]);
    }

    public function test_user_can_view_their_orders()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        Order::create([
            'user_id' => $this->user->id,
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card',
            'total_amount' => 19.98,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'delivery_address' => '123 Test St',
                        'status' => 'pending',
                        'total_amount' => '19.98'
                    ]
                ]
            ]);
    }

    public function test_user_can_view_single_order()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $order = Order::create([
            'user_id' => $this->user->id,
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card',
            'total_amount' => 19.98,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $order->id,
                    'delivery_address' => '123 Test St',
                    'status' => 'pending',
                    'total_amount' => '19.98'
                ]
            ]);
    }

    public function test_user_cannot_view_other_users_orders()
    {
        $otherUser = User::factory()->create();
        $token = $this->user->createToken('test-token')->plainTextToken;

        $order = Order::create([
            'user_id' => $otherUser->id,
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card',
            'total_amount' => 19.98,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(403);
    }

    public function test_admin_can_update_order_status()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = $admin->createToken('test-token')->plainTextToken;

        $order = Order::create([
            'user_id' => $this->user->id,
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card',
            'total_amount' => 19.98,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/orders/{$order->id}", [
                'status' => 'preparing'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'preparing'
                ]
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'preparing'
        ]);
    }

    public function test_non_admin_cannot_update_order_status()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $order = Order::create([
            'user_id' => $this->user->id,
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card',
            'total_amount' => 19.98,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/orders/{$order->id}", [
                'status' => 'preparing'
            ]);

        $response->assertStatus(403);
    }

    public function test_order_creates_order_items()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        // Add items to cart
        CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $orderData = [
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', $orderData);

        $order = Order::first();

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2,
            'price' => 9.99
        ]);
    }
} 