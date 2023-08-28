<?php

use App\Http\Controllers\Api\V1\LikedPostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebCommentController;
use App\Http\Controllers\WebPostController;
use App\Http\Controllers\WebUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/user-email-verified', function () {
    return Inertia::render('Auth/EmailVerifiedConfirmation');
})->name('user.email-verified-success');


Route::middleware(['role:Admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/test', function () {
        return Inertia::render('Test');
    })->name('test');

    Route::get('/posts', [WebPostController::class, 'index'])->name('posts.index');
    Route::get('/posts/{id}', [WebPostController::class, 'show'])->name('posts.show');
    Route::post('/posts/edit/{id}', [WebPostController::class, 'update'])->name('posts.update');
    Route::post('/posts/add', [WebPostController::class, 'store'])->name('posts.store');
    Route::delete('/posts/delete/{id}', [WebPostController::class, 'destroy'])->name('posts.destroy');
    Route::post('posts/{id}/like', [LikedPostController::class, 'store'])->name('like.store');
    Route::delete('posts/{id}/dislike', [LikedPostController::class, 'destroy'])->name('like.destroy');
    Route::post('posts/{id}/comment', [WebCommentController::class, 'addCommentToPost'])->name('comments.store');

    Route::get('/comments', [WebCommentController::class, 'index'])->name('comments.index');
    Route::get('/comments/{id}', [WebCommentController::class, 'show'])->name('comments.show');
    Route::post('/comments/edit/{id}', [WebCommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/delete/{id}', [WebCommentController::class, 'destroy'])->name('comments.destroy');

    Route::get('/users', [WebUserController::class, 'index'])->name('users.index');
    Route::post('/users/edit/{id}', [WebUserController::class, 'update'])->name('users.update');
    Route::delete('/users/delete/{id}', [WebUserController::class, 'destroy'])->name('users.destroy');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
