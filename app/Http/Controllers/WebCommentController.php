<?php

namespace App\Http\Controllers;

use App\Filters\V1\CommentFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UpdateCommentRequest;
use App\Http\Resources\V1\CommentCollection;
use App\Http\Resources\V1\CommentResource;
use App\Models\Comment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WebCommentController extends Controller
{

    public function index(Request $request)
    {
        $filter = new CommentFilter();
        $queryItems = $filter->transform($request);

        if (count($queryItems) == 0) {
            $comments = new CommentCollection(Comment::orderBy('id', 'desc')->paginate());
            return Inertia::render('Comments/Index', ['comments' => $comments]);
        } else {
            //if not done with include next page loses filter
            $comments = Comment::orderBy('id', 'desc')->where($queryItems)->paginate();
            $comments_paginated_and_filtered = new CommentCollection($comments->appends($request->query()));

            return Inertia::render('Comments/Index', ['comments' => $comments_paginated_and_filtered]);
        }
    }

    public function show($id)
    {
        $comment = Comment::find($id);
        if (!$comment) abort(404);
        return Inertia::render('Comments/Show', ['comment' => new CommentResource($comment)]);
    }

    public function update($id, Request $request)
    {
        $comment = Comment::find($id);
        $validated_request = new UpdateCommentRequest($request->toArray());
        $comment->update($validated_request->all());
    }

    public function destroy($id)
    {
        $comment = Comment::find($id);
        if ($comment->author_id !== Auth::id() || Auth::user()->hasRole('Admin')) {
            $comment->delete();
        } else {
            return response()->json(['message' => 'You are not authorized to delete this comment.'], 403);
        }
    }
}
