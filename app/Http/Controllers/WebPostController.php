<?php

namespace App\Http\Controllers;

use App\Filters\V1\PostFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StorePostRequest;
use App\Http\Resources\V1\CommentCollection;
use App\Http\Resources\V1\PostCollection;
use App\Http\Resources\V1\PostResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WebPostController extends Controller
{


    public function index(Request $request)
    {
        $filter = new PostFilter();
        $queryItems = $filter->transform($request);
        if (count($queryItems) == 0) {
            $posts = new PostCollection(Post::orderBy('id', 'desc')->paginate());
            return Inertia::render('Posts/Index', ['posts' => $posts]);
        } else {
            //if not done with appends next page loses filter
            $posts = Post::orderBy('id', 'desc')->where($queryItems)->paginate();
            $posts_paginated_and_filtered = new PostCollection($posts->appends($request->query()));
            return Inertia::render('Posts/Index', ['posts' => $posts_paginated_and_filtered]);
        }
    }

    public function show($id)
    {
        $post = Post::find($id);
        if (!$post) {
            abort(404);
        }

        $comments = Comment::orderBy('id', 'desc')
            ->where('post_id', $id)
            ->paginate();

        $commentsCollection = new CommentCollection($comments);

        return Inertia::render('Posts/Show', [
            'post' => new PostResource($post),
            'comments' => $commentsCollection,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            if (Auth::user()->hasRole('Admin')) {
                $input = [
                    'title' => $request->title,
                    'slug' => $request->slug,
                ];
                $post = Post::findOrFail($id);

                if ($request->hasfile('image')) {
                    $destination_path = 'public/';
                    $image = $request->file('image');
                    $image_name = time() . '.' . $image->getClientOriginalExtension();
                    $request->file('image')->storeAs($destination_path, $image_name);
                    $input['image'] = $image_name;
                    // Usuwanie starego pliku
                    if (file_exists(public_path("storage/" . $post->image))) {
                        unlink(public_path("storage/" . $post->image));
                    } else {
                        dd("file doesnt exist");
                    }
                }
                $post->update($input);
                return response()->json(['message' => 'Post updated successfully']);
            } else {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'Post not found'], 404);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Error updating post'], 500);
        }
    }

    public function store(StorePostRequest $request)
    {
        $request['author_id'] = Auth::id();
        $input = [
            'author_id' => Auth::id(),
            'title' => $request->title,
            'slug' => $request->slug,
        ];
        if ($request->hasfile('image')) {
            $destination_path = 'public/';
            $image = $request->file('image');
            $image_name = time() . '.' . $image->getClientOriginalExtension();
            $request->file('image')->storeAs($destination_path, $image_name);
            $input['image'] = $image_name;
        }

        return new PostResource(Post::create($input));
    }

    public function destroy($id)
    {
        try {
            $post = Post::findOrFail($id);
            if (!Auth::user()->hasRole('Admin')) {
                return response()->json(['message' => 'You are not authorized to delete this post.'], 403);
            }

            if (file_exists(public_path("storage/" . $post->image))) {
                unlink(public_path("storage/" . $post->image));
            } else {
                dd("file doesnt exist");
            }
            $post->delete();
            return response()->json(['message' => 'Post deleted successfully']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'Post not found'], 404);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Error deleting post'], 500);
        }
    }
}
