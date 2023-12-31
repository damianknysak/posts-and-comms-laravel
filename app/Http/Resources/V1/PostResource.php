<?php

namespace App\Http\Resources\V1;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;

class PostResource extends JsonResource
{
    public function paginate($items, $perPage = 15, $page = null, $options = [])
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);

        $items = $items instanceof Collection ? $items : Collection::make($items);

        return new LengthAwarePaginator($items->forPage($page, $perPage)->values(), $items->count(), $perPage, $page, $options);
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentUserReaction = $this->likes
            ->where('post_id', $this->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($currentUserReaction) {
            $reaction = $currentUserReaction->reaction;
        } else {
            $reaction = '';
        }


        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'author' => $this->author->name,
            'authorId' => $this->author->id,
            'authorImage' => $this->author->profile_image,
            'authorBlurHash' => $this->author->blur_hash,
            'image' => $this->image,
            'blurHash' => $this->blur_hash,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'commentsAmount' => $this->comments->count(),
            'likes' => [
                'totalAmount' => $this->likes->count(),
                'currentUserReaction' => $reaction,
                'likeReactionAmount' => $this->likes->where('reaction', 'like')->count(),
                'superReactionAmount' => $this->likes->where('reaction', 'super')->count(),
                'hahaReactionAmount' => $this->likes->where('reaction', 'haha')->count(),
                'cryReactionAmount' => $this->likes->where('reaction', 'cry')->count(),

            ],
            'commentsRoute' => '/comments?postId[eq]=' . $this->id
        ];
    }
}
