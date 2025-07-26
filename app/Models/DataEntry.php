<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;


class DataEntry extends Model
{
    use HasFactory, SoftDeletes, HasUlids;
    protected $table = 'data_entries';

    protected $fillable = [
        'study_entry_id',
        'variable_id',
        'value',
        'filled_by',
        'filled_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'filled_at' => 'datetime',
    ];

    public function studyEntry()
    {
        return $this->belongsTo(StudyEntry::class);
    }

    public function variable()
    {
        return $this->belongsTo(Variable::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'filled_by');
    }
}
