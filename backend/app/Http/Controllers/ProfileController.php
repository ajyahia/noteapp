<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * Update the user's profile.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'username' => 'sometimes|required|string|unique:users,username,' . $user->id . '|max:255',
            'password' => 'sometimes|required|string|min:6',
        ]);

        if ($request->has('username')) {
            $user->username = $request->username;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
            'message' => 'Profile updated successfully',
        ]);
    }
}
