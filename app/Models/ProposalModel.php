<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalModel extends Model
{
    use HasFactory;

    protected $table = 'tbl_proposals';
    protected $primaryKey = 'proposal_id';

    protected $fillable = [
        'user_id',
        'program_id',
        'project_type',
        'title',
        'details',
        'status',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'user_id');
    }

    public function program()
    {
        return $this->belongsTo(ProgramModel::class, 'program_id', 'program_id');
    }
}
