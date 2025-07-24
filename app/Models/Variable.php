<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Variable extends Model
{
    /** @use HasFactory<\Database\Factories\VariableFactory> */
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'study_id',
        'name',
        'type',
        'unit',
        'group',
        'order_index',
        'created_by',
        'updated_by',
        'deleted_by',
        'required', // Assuming this is a boolean field indicating if the variable is required
    ];

    protected $casts = [
        'required' => 'boolean',
    ];

    public function study()
    {
        return $this->belongsTo(Study::class);
    }
}
