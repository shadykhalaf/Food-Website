<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuItemController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::with('category')->get();
        return response()->json($menuItems);
    }

    public function create()
    {
        $categories = Category::all();
        return view('menu-items.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_available' => 'boolean',
            'preparation_time' => 'nullable|integer|min:1'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-items', 'public');
            $validated['image'] = $path;
        }

        $menuItem = MenuItem::create($validated);

        return response()->json([
            'message' => 'Menu item created successfully',
            'menuItem' => $menuItem
        ], 201);
    }

    public function show(MenuItem $menuItem)
    {
        return view('menu-items.show', compact('menuItem'));
    }

    public function edit(MenuItem $menuItem)
    {
        $categories = Category::all();
        return view('menu-items.edit', compact('menuItem', 'categories'));
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_available' => 'boolean',
            'preparation_time' => 'nullable|integer|min:1'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-items', 'public');
            $validated['image'] = $path;
        }

        $menuItem->update($validated);

        return response()->json([
            'message' => 'Menu item updated successfully',
            'menuItem' => $menuItem
        ]);
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();
        return response()->json(['message' => 'Menu item deleted successfully']);
    }
} 
