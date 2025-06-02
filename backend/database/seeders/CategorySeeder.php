<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Breakfast',
                'description' => 'Start your day with our delicious breakfast options',
            ],
            [
                'name' => 'Pizza',
                'description' => 'Handcrafted pizzas with fresh ingredients',
            ],
            [
                'name' => 'Burgers',
                'description' => 'Juicy burgers with premium toppings',
            ],
            [
                'name' => 'Desserts',
                'description' => 'Sweet treats to satisfy your cravings',
            ],
            [
                'name' => 'Drinks',
                'description' => 'Refreshing beverages to complement your meal',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}