<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(PostRequest $request)
    {
        // Create user
        $user = User::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create token for user
        $token = $user->createToken('authToken')->plainTextToken;

        // Return success response
        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Attempt to log the user in
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            // Get the authenticated user
            $user = Auth::user();
            // Create token for user
            $token = $user->createToken('authToken')->plainTextToken;

            // Return success response
            return response()->json([
                'message' => 'User logged in successfully!',
                'user' => $user,
                'token' => $token,
            ], 200);
        }

        // Return error response if authentication fails
        return response()->json([
            'message' => 'Invalid email or password.',
        ], 401);
    }

    public function logout(Request $request)
    {
        // Revoke the current user’s token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully!',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
