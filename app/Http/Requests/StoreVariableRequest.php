<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVariableRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'study_id' => 'required|exists:studies,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'unit' => 'nullable|string|max:50',
            'group' => 'nullable|string|max:50',
            'order_index' => 'nullable|integer',
            'created_by' => 'nullable|integer',
            'updated_by' => 'nullable|integer',
            'deleted_by' => 'nullable|integer',
            'required' => 'boolean', // Assuming this is a boolean field indicating if the variable is required
        ];
    }
}
