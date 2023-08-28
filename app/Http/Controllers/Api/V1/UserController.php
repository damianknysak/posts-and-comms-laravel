<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Bepsvpt\Blurhash\Facades\BlurHash;
use Buglinjo\LaravelWebp\Facades\Webp;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{


    public function update(Request $request, $id)
    {
        if (Auth::id() != $id) {
            return response("Unauthorized", 401);
        }
        $user = User::find($id);
        if (!$user) return response(['User not found', 404]);
        $input = $request->all();
        if ($request->hasfile('profile_image')) {
            $file = $request->file('profile_image');
            $image_name = time() . '.' . 'webp';

            $blur = BlurHash::encode($file);
            $webp = Webp::make($file);
            $webp->save(public_path('/storage/' . $image_name));
            $input['profile_image'] = $image_name;
            $input['blur_hash'] = $blur;

            // Usuwanie starego pliku
            if ($user->profile_image != "profile_images/default_profile_image.png") {
                if (file_exists(public_path("storage/" . $user->profile_image))) {
                    unlink(public_path("storage/" . $user->profile_image));
                } else {
                    dd("file doesnt exist");
                }
            }
        }
        if (!file_exists(public_path("storage/" . $user->profile_image))) {
            $user['profile_image'] = "profile_images/default_profile_image.png";
        }
        $user->update($input);
    }

    public function show($id)
    {
        try {
            if (Auth::id() !=  $id) return response('Unauthorized', 401);

            $user = User::find($id);
            if (!$user) return response('User not found', 404);
            return $user;
        } catch (Exception $err) {
            return response($err, 500);
        }
    }

    public function update_password(Request $request, $id)
    {
        try {
            if (Auth::id() != $id) return response("Unauthorized", 401);
            $user = User::find($id);

            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
            return response("Password Updated", 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e], 500);
        }
    }
}
