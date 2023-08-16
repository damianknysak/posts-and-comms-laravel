<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'comment' => ['required'],
            'authorId' => ['required', Rule::exists('users', 'id')],
            'postId' => ['required', Rule::exists('posts', 'id')]
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'author_id' => $this->authorId,
            'post_id' => $this->postId
        ]);
    }
}
