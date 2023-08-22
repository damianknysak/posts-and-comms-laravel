<?php

namespace App\Filters\V1;

use App\Filters\ApiFilter;
use Illuminate\Http\Request;

class PostFilter extends ApiFilter
{
    protected $safeParms = [
        'authorId' => ['eq'],
        'postId' => ['eq'],
        'slug' => ['eq']
    ];

    protected $columnMap = [
        'authorId' => 'author_id',
        'postId' => 'id',
        'slug' => 'slug'
    ];

    protected $operatorMap = [
        'eq' => '='
    ];
}
