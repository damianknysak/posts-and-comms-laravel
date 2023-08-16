<?php

namespace App\Filters\V1;

use App\Filters\ApiFilter;
use Illuminate\Http\Request;

class PostFilter extends ApiFilter
{
    protected $safeParms = [
        'authorId' => ['eq']
    ];

    protected $columnMap = [
        'authorId' => 'author_id'
    ];

    protected $operatorMap = [
        'eq' => '='
    ];
}
