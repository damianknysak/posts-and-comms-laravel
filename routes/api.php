<?php

use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1'], function () {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1', 'middleware' => 'auth:sanctum'], function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/validate-token', function () {
        return ['Token is valid'];
    });

    Route::apiResource('posts', PostController::class);
    Route::apiResource('comments', CommentController::class);

    Route::get('likedposts', 'LikedPostController@index');

    Route::delete('posts/delete/{id}', 'PostController@destroy');
    Route::post('posts/edit/{id}', 'PostController@update');
    Route::post('posts/add', 'PostController@store');

    Route::post('posts/{id}/like', 'LikedPostController@store');
    Route::delete('posts/{id}/dislike', 'LikedPostController@destroy');

    Route::post('posts/{id}/comment', 'CommentController@addCommentToPost');
    Route::put('posts/edit-comment/{id}', 'CommentController@editComment');
    Route::delete('posts/remove-comment/{id}', 'CommentController@destroy');
});
