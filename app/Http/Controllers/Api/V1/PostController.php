<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostCollection;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Resources\V1\PostResource;
use App\Filters\V1\PostFilter;
use App\Http\Requests\V1\StorePostRequest;
use Bepsvpt\Blurhash\Facades\BlurHash;
use Buglinjo\LaravelWebp\Facades\Webp;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $filter = new PostFilter();
        $queryItems = $filter->transform($request);

        if (count($queryItems) == 0) {
            // zapytaj o to
            // return new PostCollection(Post::orderBy('created_at', 'desc')->paginate());
            return new PostCollection(Post::orderBy('id', 'desc')->paginate());
        } else {
            //if not done with appends next page loses filter
            $posts = Post::orderBy('id', 'desc')->where($queryItems)->paginate();
            return new PostCollection($posts->appends($request->query()));
        }
    }

    public function show(Post $post)
    {
        return new PostResource($post);
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
            $file = $request->file('image');
            $image_name = time() . '.' . 'webp';
            Image::make($file)->resize(640, 480)->encode("webp")
                ->save(public_path('/storage/' . $image_name));

            $blur = BlurHash::encode($file);
            $input['image'] = $image_name;
            $input['blur_hash'] = $blur;
        }
        return new PostResource(Post::create($input));
    }

    public function update(Request $request, $id)
    {
        try {
            $request['author_id'] = Auth::id();
            $input = [
                'author_id' => Auth::id(),
                'title' => $request->title,
                'slug' => $request->slug,
            ];
            $post = Post::findOrFail($id);

            if ($request->hasfile('image')) {
                $file = $request->file('image');
                $image_name = time() . '.' . 'webp';
                Image::make($file)->resize(640, 480)->encode("webp")
                    ->save(public_path('/storage/' . $image_name));

                $blur = BlurHash::encode($file);
                $input['image'] = $image_name;
                $input['blur_hash'] = $blur;

                //delete old file
                if (file_exists(public_path("storage/" . $post->image))) {
                    unlink(public_path("storage/" . $post->image));
                } else {
                    dd("file doesnt exist");
                }
            }
            $post->update($input);
            return response()->json(['message' => 'Post updated successfully']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'Post not found'], 404);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Error updating post'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $post = Post::findOrFail($id);
            if ($post->author_id !== Auth::id()) {
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
