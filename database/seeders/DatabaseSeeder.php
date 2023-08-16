<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\LikedPost;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        Post::factory()->count(5)
            ->hasComments(100)
            ->hasLikes(50)
            ->create();

        Post::factory()->count(2)
            ->hasComments(0)
            ->create();

        Post::factory()->count(3)
            ->hasLikes(10)
            ->create();

        User::factory()->count(2)
            ->hasLikes(5)
            ->create();

        Post::factory()->count(20)
            ->hasComments(10)
            ->hasLikes(20)
            ->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
