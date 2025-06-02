<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\MenuItem;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MenuItemTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->user = User::factory()->create();
    }

    public function test_public_can_view_menu_items()
    {
        $menuItems = MenuItem::factory()->count(3)->create();

        $response = $this->getJson('/api/menu-items');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_public_can_view_single_menu_item()
    {
        $menuItem = MenuItem::factory()->create();

        $response = $this->getJson("/api/menu-items/{$menuItem->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $menuItem->id,
                    'name' => $menuItem->name
                ]
            ]);
    }

    public function test_admin_can_create_menu_item()
    {
        $category = Category::factory()->create();
        
        $menuItemData = [
            'name' => 'Test Item',
            'description' => 'Test Description',
            'price' => 9.99,
            'category_id' => $category->id,
            'is_available' => true,
            'preparation_time' => 15
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/menu-items', $menuItemData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'name' => 'Test Item',
                    'price' => '9.99'
                ]
            ]);

        $this->assertDatabaseHas('menu_items', [
            'name' => 'Test Item',
            'price' => 9.99
        ]);
    }

    public function test_admin_can_update_menu_item()
    {
        $menuItem = MenuItem::factory()->create();

        $updateData = [
            'name' => 'Updated Item',
            'price' => 12.99
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/menu-items/{$menuItem->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name' => 'Updated Item',
                    'price' => '12.99'
                ]
            ]);
    }

    public function test_admin_can_delete_menu_item()
    {
        $menuItem = MenuItem::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/menu-items/{$menuItem->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('menu_items', [
            'id' => $menuItem->id
        ]);
    }

    public function test_non_admin_cannot_create_menu_item()
    {
        $menuItemData = [
            'name' => 'Test Item',
            'description' => 'Test Description',
            'price' => 9.99
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/menu-items', $menuItemData);

        $response->assertStatus(403);
    }
} 