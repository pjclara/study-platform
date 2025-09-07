<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariableOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'variable_id',
        'value',
        'order_index',
    ];

    public function variable()
    {
        return $this->belongsTo(Variable::class);
    }
}
