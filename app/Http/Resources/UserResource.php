<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'emailVerifiedAt' => $this->email_verified_at,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'postsAmount' => $this->posts->where('author_id',  $this->id)->count(),
            'postsRoute' => '/posts?authorId[eq]=' . $this->id,
            'commentsAmount' => $this->comments->where('author_id',  $this->id)->count(),
            'commentsRoute' => '/comments?authorId[eq]=' . $this->id,
            'profileImage' => $this->profile_image
        ];
    }
}
