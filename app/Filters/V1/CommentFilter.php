<?php

namespace App\Filters\V1;

use App\Filters\ApiFilter;
use Illuminate\Http\Request;

class CommentFilter extends ApiFilter
{
    protected $safeParms = [
        'authorId' => ['eq'],
        'postId' => ['eq']
    ];

    protected $columnMap = [
        'authorId' => 'author_id',
        'postId' => 'post_id'
    ];

    protected $operatorMap = [
        'eq' => '='
    ];
}
