<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;

class TableSeeder extends Seeder
{
    public function run()
    {
        $tables = [
            [
                'name' => 'Table 1',
                'capacity' => 2,
                'status' => 'available',
                'description' => 'Window seat, perfect for couples'
            ],
            [
                'name' => 'Table 2',
                'capacity' => 4,
                'status' => 'available',
                'description' => 'Center area, family-friendly'
            ],
            [
                'name' => 'Table 3',
                'capacity' => 6,
                'status' => 'available',
                'description' => 'Large table, good for groups'
            ],
            [
                'name' => 'Table 4',
                'capacity' => 8,
                'status' => 'available',
                'description' => 'Private area, perfect for celebrations'
            ],
            [
                'name' => 'Table 5',
                'capacity' => 2,
                'status' => 'available',
                'description' => 'Quiet corner, romantic setting'
            ],
            [
                'name' => 'Table 6',
                'capacity' => 4,
                'status' => 'available',
                'description' => 'Near kitchen, lively atmosphere'
            ],
            [
                'name' => 'Table 7',
                'capacity' => 10,
                'status' => 'available',
                'description' => 'Large party table, reservation recommended'
            ],
            [
                'name' => 'Table 8',
                'capacity' => 3,
                'status' => 'available',
                'description' => 'Bar adjacent, casual dining'
            ]
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
} 
