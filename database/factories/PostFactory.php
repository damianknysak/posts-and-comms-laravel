<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'slug' => 'to-jest-slug',
            'author_id' => User::all()->random()->id,
            'image' => $this->faker->image('public/storage', 640, 480, null, false),
            'blur_hash' => 'LOI~3_WB~pWB_3ofIUj[00fQ00WC'
        ];
    }
}
