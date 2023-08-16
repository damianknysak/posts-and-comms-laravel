<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class WebPostController extends Controller
{
    public function index(Request $request)
    { //'4|rWgeBjo7Wfk1s55fwcZSo8IL1OsrLNyXuMMrqptX'
        $request = Request::create('/api/v1/posts/add', 'POST');
        $request->headers->set('Authorization', 'Bearer ' . $request['_token']);
        $response = Route::dispatch($request);
        dd($response->getContent());
    }
}
