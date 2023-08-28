<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'author_id',
        'image',
        'blur_hash'
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function author()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(LikedPost::class);
    }
}
