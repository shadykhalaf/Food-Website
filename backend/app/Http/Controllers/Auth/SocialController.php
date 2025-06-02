<?php
namespace App\Http\Controllers\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;



use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SocialController extends Controller
{
    public function redirect($provider)
{
    return Socialite::driver($provider)->redirect();
}

public function callback($provider)
{
    try {
        $socialUser = Socialite::driver($provider)->user();
    } catch (\Exception $e) {
        return redirect('/login')->with('error', 'Unable to login using ' . $provider . '. Please try again.');
    }

    // Find or create user
    $user = User::where('provider_id', $socialUser->getId())
        ->orWhere('email', $socialUser->getEmail())
        ->first();

    if (!$user) {
        $user = User::create([
            'name' => $socialUser->getName() ?? $socialUser->getNickname(),
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'password' => bcrypt(uniqid()), // random password
        ]);
    } else {
        // Update provider info if needed
        $user->update([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ]);
    }

    Auth::login($user, true);

    return redirect('/'); // or wherever you want to redirect after login
}
}
