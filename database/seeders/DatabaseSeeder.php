<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\LikedPost;
use App\Models\Post;
use App\Models\User;
use Bepsvpt\Blurhash\Facades\BlurHash;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //tworzenie permissions
        $permissions = [
            'role-list',
            'role-create',
            'role-edit',
            'role-delete',
            'user-list',
            'user-create',
            'user-edit',
            'user-delete',
            'post-list',
            'post-create',
            'post-edit',
            'post-delete',
            'comment-list',
            'comment-create',
            'comment-edit',
            'comment-delete'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // tworzenie roli

        $role = Role::create(['name' => 'Admin']);

        $permissions = Permission::pluck('id', 'id')->all();

        $role->syncPermissions($permissions);

        $role = Role::create(['name' => 'User']);

        //tworzenie admina
        $user = User::create([
            'name' => 'Damian Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('test123'),
            'profile_image' => 'profile_images/default_profile_image.png',
            'blur_hash' => 'LOI~3_WB~pWB_3ofIUj[00fQ00WC',
            'date_of_birth' => Carbon::createFromTimestamp(rand(strtotime('1980-01-01'), strtotime('2005-12-31')))
        ]);

        $user->assignRole([1]);

        User::factory()->count(100)->create();

        Post::factory()->count(5)
            ->hasComments(105)
            // ->hasLikes(123)
            ->create();

        // Tworzenie 2 postów z 20 lajkami i 10 komentarzami
        Post::factory()->count(2)
            ->hasComments(10)
            ->hasLikes(20)
            ->create();

        // Tworzenie 4 postów z 50 lajkami i 23 komentarzami
        Post::factory()->count(4)
            ->hasComments(23)
            // ->hasLikes(50)
            ->create();

        // Tworzenie 10 postów z 40 komentarzami i 10 lajkami
        Post::factory()->count(10)
            ->hasComments(40)
            // ->hasLikes(10)
            ->create();


        Post::factory()->count(20)
            ->hasComments(10)
            // ->hasLikes(20)
            ->create();

        //tworzenie lajków
        for ($i = 0; $i < 1000; $i++) {
            $reactions = array('like', 'super', 'haha', 'cry');
            $random_reaction =  $reactions[array_rand($reactions)];
            $post_rand_id = Post::all()->random()->id;
            $user_rand_id = User::all()->random()->id;
            while (LikedPost::where('post_id', '=', $post_rand_id)->where(
                'user_id',
                '=',
                $user_rand_id
            )->first()) {
                $post_rand_id = Post::all()->random()->id;
                $user_rand_id = User::all()->random()->id;
            }
            LikedPost::factory()->create([
                'post_id' => $post_rand_id,
                'user_id' => $user_rand_id,
                'reaction' => $random_reaction,
            ]);
        }

        //dodawanie blura do kazdego zdjecia
        $posts = Post::all();
        foreach ($posts as $post) {
            $imagePath = $post->image; // Przyjmuję, że pole 'image' zawiera ścieżkę do obrazu

            // Przekształcenie ścieżki do instancji UploadedFile
            $uploadedFile = new UploadedFile(
                storage_path('app/public/' . $imagePath), // Pełna ścieżka do pliku
                pathinfo($imagePath, PATHINFO_BASENAME) // Oryginalna nazwa pliku
            );

            // Generowanie BlurHash na podstawie pliku
            $blur = BlurHash::encode($uploadedFile);

            // Aktualizuj pole hash_blur
            DB::table('posts')
                ->where('id', $post->id)
                ->update(['blur_hash' => $blur]);
        }
    }
}
