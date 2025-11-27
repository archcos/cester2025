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
        'proponent_id',
        'collaborator_id',
        'beneficiary_id',
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

    public function proponent()
    {
        return $this->belongsTo(ProponentModel::class, 'proponent_id', 'proponent_id');
    }

    public function collaborator()
    {
        return $this->belongsTo(CollaboratorModel::class, 'collaborator_id', 'collaborator_id');
    }

    public function beneficiary()
    {
        return $this->belongsTo(BeneficiaryModel::class, 'beneficiary_id', 'beneficiary_id');
    }
}
