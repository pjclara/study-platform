<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class StudyEntry extends Model
{
    /** @use HasFactory<\Database\Factories\StudyEntryFactory> */
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'study_id',
        'identifier',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function study()
    {
        return $this->belongsTo(Study::class);
    }

    public function dataEntries()
    {
        return $this->hasMany(DataEntry::class);
    }

    

}
