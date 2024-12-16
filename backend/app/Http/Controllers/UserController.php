<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Update profile picture.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadProfilePicture(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Check if the user already has a profile picture and delete it if necessary
        $user = auth()->user();
        if ($user->profile_picture) {
            // Delete the old profile picture from storage
            Storage::delete('public/' . $user->profile_picture);
        }

        // Store the new profile picture
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');

        // Update the user's profile picture in the database
        $user->profile_picture = $path;
        $user->save();

        // Return the new profile picture URL
        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'profile_picture_url' => Storage::url($path),
        ], 200);
    }
    public function getProfile(Request $request)
    {
        $user = $request->user(); // Get the authenticated user
        $profilePictureUrl = $user->profile_picture ? url('storage/' . $user->profile_picture) : null;

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'profile_picture' => $profilePictureUrl, // Return the profile picture URL
        ]);
    }
}
