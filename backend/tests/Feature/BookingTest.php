<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
    }

    public function test_user_can_create_booking()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $bookingData = [
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'special_requests' => 'Window seat preferred'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'user_id' => $this->user->id,
                    'date' => '2024-03-25',
                    'time' => '19:00',
                    'guests' => 4,
                    'special_requests' => 'Window seat preferred',
                    'status' => 'pending'
                ]
            ]);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $this->user->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);
    }

    public function test_user_cannot_create_booking_in_past()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $bookingData = [
            'date' => Carbon::yesterday()->format('Y-m-d'),
            'time' => '19:00',
            'guests' => 4
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date']);
    }

    public function test_user_cannot_create_booking_with_invalid_guests()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $bookingData = [
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 0
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['guests']);
    }

    public function test_user_can_view_their_bookings()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        Booking::create([
            'user_id' => $this->user->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/bookings');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'date' => '2024-03-25',
                        'time' => '19:00',
                        'guests' => 4,
                        'status' => 'pending'
                    ]
                ]
            ]);
    }

    public function test_user_can_view_single_booking()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $booking = Booking::create([
            'user_id' => $this->user->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $booking->id,
                    'date' => '2024-03-25',
                    'time' => '19:00',
                    'guests' => 4,
                    'status' => 'pending'
                ]
            ]);
    }

    public function test_user_cannot_view_other_users_bookings()
    {
        $otherUser = User::factory()->create();
        $token = $this->user->createToken('test-token')->plainTextToken;

        $booking = Booking::create([
            'user_id' => $otherUser->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_cancel_booking()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $booking = Booking::create([
            'user_id' => $this->user->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'cancelled'
                ]
            ]);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled'
        ]);
    }

    public function test_admin_can_update_booking_status()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = $admin->createToken('test-token')->plainTextToken;

        $booking = Booking::create([
            'user_id' => $this->user->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/bookings/{$booking->id}", [
                'status' => 'confirmed'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'confirmed'
                ]
            ]);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'confirmed'
        ]);
    }

    public function test_non_admin_cannot_update_booking_status()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $booking = Booking::create([
            'user_id' => $this->user->id,
            'date' => '2024-03-25',
            'time' => '19:00',
            'guests' => 4,
            'status' => 'pending'
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/bookings/{$booking->id}", [
                'status' => 'confirmed'
            ]);

        $response->assertStatus(403);
    }

    public function test_booking_validation_rules()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $invalidData = [
            'date' => 'invalid-date',
            'time' => '25:00',
            'guests' => -1
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/bookings', $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date', 'time', 'guests']);
    }
} 