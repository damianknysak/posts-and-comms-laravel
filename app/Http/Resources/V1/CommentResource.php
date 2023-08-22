<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'comment' => $this->comment,
            'author' => $this->author,
            'authorId' => $this->author->id,
            'authorImage' => $this->author->profile_image,
            'postId' => $this->post_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'postRoute' => '/posts?postId[eq]=' . $this->post_id
        ];
    }
}
