<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramModel extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'tbl_programs';

    // Primary key
    protected $primaryKey = 'program_id';

    // Allow auto-increment
    public $incrementing = true;

    // Use small integer for key
    protected $keyType = 'int';

    // Enable timestamps
    public $timestamps = true;

    // Fillable fields for mass assignment
    protected $fillable = [
        'program_name',
    ];

    /**
     * Relationships
     * If a Proposal belongs to a Program, you can define:
     */
    public function proposals()
    {
        return $this->hasMany(ProposalModel::class, 'program_id', 'program_id');
    }
}
