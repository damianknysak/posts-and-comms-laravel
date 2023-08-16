<?php

namespace App\Http\Controllers\Api\V1;

use App\Filters\V1\CommentFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreCommentRequest;
use App\Http\Requests\V1\StorePostRequest;
use App\Http\Requests\V1\UpdateCommentRequest;
use App\Http\Resources\V1\CommentCollection;
use App\Http\Resources\V1\CommentResource;
use App\Models\Comment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{

    public function index(Request $request)
    {
        $filter = new CommentFilter();
        $queryItems = $filter->transform($request);

        if (count($queryItems) == 0) {
            return new CommentCollection(Comment::orderBy('id', 'desc')->paginate());
        } else {
            //if not done with include next page loses filter
            $comments = Comment::orderBy('id', 'desc')->where($queryItems)->paginate();
            return new CommentCollection($comments->appends($request->query()));
        }
    }


    public function show(Comment $comment)
    {
        return new CommentResource($comment);
    }

    public function store(StoreCommentRequest $request)
    {
        $data = $request->all();

        return new CommentResource(Comment::create($data));
    }

    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        $comment->update($request->all());
    }

    public function destroy($id)
    {
        try {
            $comment = Comment::findOrFail($id);
            if ($comment->author_id !== Auth::id()) {
                return response()->json(['message' => 'You are not authorized to delete this comment.'], 403);
            }
            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully']);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['message' => 'Comment not found'], 404);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Error deleting comment'], 500);
        }
    }

    public function addCommentToPost($id, Request $request)
    {
        $validator = Validator::make([
            'comment' => $request->input('comment'),
            'authorId' => Auth::id(),
            'postId' => $id,
        ], [
            'comment' => ['required'],
            'authorId' => ['required', Rule::exists('users', 'id')],
            'postId' => ['required', Rule::exists('posts', 'id')]
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'author_id' => Auth::id(),
            'post_id' => $id,
            'comment' => $request->input('comment')
        ];

        return new CommentResource(Comment::create($data));
    }

    public function editComment($id, Request $request)
    {

        $comment = Comment::find($id);
        $validated_request = new UpdateCommentRequest($request->toArray());
        $comment->update($validated_request->all());
    }
}
