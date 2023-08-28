<?php

namespace App\Http\Controllers;

use App\Jobs\SendVerificationEmail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
            'profile_image' => 'profile_images/default_profile_image.png',
            'blur_hash' => 'LOI~3_WB~pWB_3ofIUj[00fQ00WC',
        ]);

        $token = $user->createToken('user-token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        SendVerificationEmail::dispatch($user);

        // $user->sendEmailVerificationNotification();

        return Response($response, 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'

        ]);

        $user = User::where('email', $fields['email'])->first();
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                "message" => "Wrong credentials"
            ], 401);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return Response($response, 201);
    }

    public function logout(Request $request)
    {
        $user = request()->user();
        $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();

        return [
            'message' => 'Logged out'
        ];
    }

    public function is_email_verified($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'User is verified'], 200);
        } else {
            return response()->json(['message' => 'User is not verified'], 401);
        }
    }

    public function send_verification_email(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'

        ]);

        $user = User::where('email', $fields['email'])->first();
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                "message" => "Wrong credentials"
            ], 401);
        }

        SendVerificationEmail::dispatch($user);

        return response([
            "message" => "Email sent"
        ], 200);
    }
}
