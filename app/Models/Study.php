<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Study extends Model
{
    /** @use HasFactory<\Database\Factories\StudyFactory> */
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'study_type',
        'end_date',
        'ethical_approval',
        'status',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'ethical_approval' => 'boolean',
    ];

    public function variables()
    {
        return $this->hasMany(Variable::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
