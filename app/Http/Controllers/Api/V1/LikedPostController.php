<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\LikedPostFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreLikedPostRequest;
use App\Http\Resources\V1\LikedPostCollection;
use App\Http\Resources\V1\LikedPostResource;
use App\Models\LikedPost;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LikedPostController extends Controller
{

    public function index(Request $request)
    {
        $filter = new LikedPostFilter();
        $queryItems = $filter->transform($request);

        if (count($queryItems) == 0) {
            return new LikedPostCollection(LikedPost::orderBy('id', 'desc')->get());
        } else {
            $liked_posts = LikedPost::orderBy('id', 'desc')->where($queryItems)->get();
            return new LikedPostCollection($liked_posts);
        }
    }

    public function usersReactionAmountInfo()
    {
        $likeReactionCount = LikedPost::where('user_id', Auth::id())->count();

        return $likeReactionCount;
    }
    public function store($id, StoreLikedPostRequest $request)
    {
        $validator = Validator::make([
            'userId' => Auth::id(),
            'postId' => $id,
        ], [
            'userId' => ['required', Rule::exists('users', 'id')],
            'postId' => ['required', Rule::exists('posts', 'id')]
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => "Wrong Like Request"], 422);
        }

        $existingLikedPost = LikedPost::where('user_id', Auth::id())->where('post_id', $id)->first();
        $data = [
            'user_id' => Auth::id(),
            'post_id' => $id,
            'reaction' => $request->input('reaction')
        ];

        if ($existingLikedPost) {
            // Zaktualizuj istniejący polubiony post i zwróć odpowiedź
            $existingLikedPost->update(['reaction' => $data['reaction']]);
            return response()->json(['message' => "Like updated successfully"], 200);
        } else {
            // Dodaj nowy polubiony post i zwróć odpowiedź
            LikedPost::create($data);
            return response()->json(['message' => "Like added successfully"], 200);
        }
    }
    public function destroy($id)
    {
        try {
            $likedPost = LikedPost::where('post_id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            if ($likedPost) $likedPost->delete();

            return response()->json(['message' => 'Like deleted successfully']);
        } catch (Exception $exception) {
            return response()->json(['message' => 'Like not found'], 404);
        }
    }
}
