<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Review;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $menuItem;
    protected $order;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->menuItem = MenuItem::factory()->create();
        $this->order = Order::create([
            'user_id' => $this->user->id,
            'delivery_address' => '123 Test St',
            'phone_number' => '1234567890',
            'payment_method' => 'credit_card',
            'total_amount' => 19.98,
            'status' => 'completed'
        ]);
    }

    public function test_user_can_create_review()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $reviewData = [
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/reviews', $reviewData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'user_id' => $this->user->id,
                    'menu_item_id' => $this->menuItem->id,
                    'order_id' => $this->order->id,
                    'rating' => 5,
                    'comment' => 'Great food and service!'
                ]
            ]);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5
        ]);
    }

    public function test_user_cannot_create_review_with_invalid_rating()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $reviewData = [
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 6,
            'comment' => 'Great food and service!'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/reviews', $reviewData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);
    }

    public function test_user_cannot_review_unordered_item()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $reviewData = [
            'menu_item_id' => 999,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/reviews', $reviewData);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Menu item was not part of this order'
            ]);
    }

    public function test_user_can_view_menu_item_reviews()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        Review::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/menu-items/{$this->menuItem->id}/reviews");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'rating' => 5,
                        'comment' => 'Great food and service!',
                        'user' => [
                            'name' => $this->user->name
                        ]
                    ]
                ]
            ]);
    }

    public function test_user_can_update_their_review()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $review = Review::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ]);

        $updateData = [
            'rating' => 4,
            'comment' => 'Updated review'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/reviews/{$review->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'rating' => 4,
                    'comment' => 'Updated review'
                ]
            ]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 4,
            'comment' => 'Updated review'
        ]);
    }

    public function test_user_cannot_update_other_users_review()
    {
        $otherUser = User::factory()->create();
        $token = $this->user->createToken('test-token')->plainTextToken;

        $review = Review::create([
            'user_id' => $otherUser->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ]);

        $updateData = [
            'rating' => 4,
            'comment' => 'Updated review'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/reviews/{$review->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_their_review()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $review = Review::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/reviews/{$review->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('reviews', [
            'id' => $review->id
        ]);
    }

    public function test_user_cannot_delete_other_users_review()
    {
        $otherUser = User::factory()->create();
        $token = $this->user->createToken('test-token')->plainTextToken;

        $review = Review::create([
            'user_id' => $otherUser->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great food and service!'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/reviews/{$review->id}");

        $response->assertStatus(403);
    }

    public function test_review_averages_are_calculated_correctly()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        // Create multiple reviews for the same menu item
        Review::create([
            'user_id' => $this->user->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 5,
            'comment' => 'Great!'
        ]);

        $otherUser = User::factory()->create();
        Review::create([
            'user_id' => $otherUser->id,
            'menu_item_id' => $this->menuItem->id,
            'order_id' => $this->order->id,
            'rating' => 3,
            'comment' => 'Good'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/menu-items/{$this->menuItem->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'average_rating' => 4.0,
                    'total_reviews' => 2
                ]
            ]);
    }
} 