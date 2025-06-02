<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SocialLoginController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('email', $googleUser->email)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'provider' => 'google',
                    'provider_id' => $googleUser->id,
                ]);
            }

            Auth::login($user);
            
            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect()->away('http://localhost:5173/auth/callback?token=' . $token);
        } catch (\Exception $e) {
            return redirect()->away('http://localhost:5173/login?error=' . urlencode($e->getMessage()));
        }
    }

    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->redirect();
    }

    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->user();
            
            $user = User::where('email', $facebookUser->email)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => $facebookUser->name,
                    'email' => $facebookUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'provider' => 'facebook',
                    'provider_id' => $facebookUser->id,
                ]);
            }

            Auth::login($user);
            
            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect()->away('http://localhost:5173/auth/callback?token=' . $token);
        } catch (\Exception $e) {
            return redirect()->away('http://localhost:5173/login?error=' . urlencode($e->getMessage()));
        }
    }
} 