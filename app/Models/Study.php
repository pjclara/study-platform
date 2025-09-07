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
        return $this->hasMany(Variable::class)->with('options')->orderBy('order_index');
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function dataEntries()
    {
        return $this->hasManyThrough(
            DataEntry::class,
            Variable::class,
            'study_id', // Foreign key on Variable table...
            'variable_id', // Foreign key on DataEntry table...
            'id', // Local key on Study table...
            'id' // Local key on Variable table...
        );
    }

    public function studyEntries() {
         return $this->hasMany(StudyEntry::class)->with('dataEntries');
    }
}
