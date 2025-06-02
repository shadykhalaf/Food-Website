<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\MenuItem;
use App\Models\CartItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CartTest extends TestCase
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

    public function test_user_can_add_item_to_cart()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart', [
                'menu_item_id' => $this->menuItem->id,
                'quantity' => 2
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'menu_item_id' => $this->menuItem->id,
                    'quantity' => 2,
                    'price' => '9.99'
                ]
            ]);

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);
    }

    public function test_user_cannot_add_invalid_item_to_cart()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart', [
                'menu_item_id' => 999,
                'quantity' => 2
            ]);

        $response->assertStatus(404);
    }

    public function test_user_can_view_cart()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/cart');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'menu_item_id' => $this->menuItem->id,
                        'quantity' => 2,
                        'price' => '9.99'
                    ]
                ]
            ]);
    }

    public function test_user_can_update_cart_item()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $cartItem = CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/cart/{$cartItem->id}", [
                'quantity' => 3
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'quantity' => 3
                ]
            ]);

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 3
        ]);
    }

    public function test_user_can_remove_cart_item()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $cartItem = CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/cart/{$cartItem->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id
        ]);
    }

    public function test_user_can_clear_cart()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/cart');

        $response->assertStatus(204);

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_cart_calculates_total_correctly()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $menuItem2 = MenuItem::factory()->create([
            'price' => 14.99
        ]);

        CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        CartItem::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $menuItem2->id,
            'quantity' => 1
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/cart');

        $response->assertStatus(200)
            ->assertJson([
                'total' => '34.97' // (9.99 * 2) + 14.99
            ]);
    }

    public function test_user_cannot_access_other_users_cart()
    {
        $otherUser = User::factory()->create();
        $token = $this->user->createToken('test-token')->plainTextToken;

        $cartItem = CartItem::create([
            'user_id' => $otherUser->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/cart/{$cartItem->id}");

        $response->assertStatus(403);
    }
} 