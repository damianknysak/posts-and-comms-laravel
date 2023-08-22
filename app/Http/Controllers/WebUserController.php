<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserCollection;
use App\Http\Resources\V1\CommentCollection;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WebUserController extends Controller
{

    public function index()
    {
        return Inertia::render('Users/Index', ['users' => new UserCollection(User::orderBy('id', 'desc')->paginate())]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response(['User not found', 404]);
        if (Auth::user()->hasRole('Admin') || Auth::id() == $id) {
            $input = [
                'name' => $request->name,
            ];
            if ($request->hasfile('profile_image')) {
                $destination_path = 'public/profile_images';
                $image = $request->file('profile_image');
                $image_name = time() . '.' . $image->getClientOriginalExtension();
                $request->file('profile_image')->storeAs($destination_path, $image_name);
                $input['profile_image'] = 'profile_images/' . $image_name;

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
        } else {
            return response(["Unauthorized", 401]);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            if (!Auth::user()->hasRole('Admin')) {
                return response()->json(['message' => 'You are not authorized to delete this post.'], 403);
            }
            $profile_img = $user->profile_image;
            $user->delete();

            if ($profile_img != "profile_images/default_profile_image.png") {
                if (file_exists(public_path("storage/" . $profile_img))) {
                    unlink(public_path("storage/" . $profile_img));
                } else {
                    dd("file doesnt exist");
                }
            }
            return response()->json(['message' => 'Post deleted successfully']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'Post not found'], 404);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Error deleting post'], 500);
        }
    }
}
