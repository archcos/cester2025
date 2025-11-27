<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollaboratorModel extends Model
{
    use HasFactory;

    protected $table = 'tbl_collaborators';
    protected $primaryKey = 'collaborator_id';

    protected $fillable = [
        'collaborator_name',
    ];


    // A collaborator can have many proposals
    public function proposals()
    {
        return $this->hasMany(ProposalModel::class, 'collaborator_id', 'collaborator_id');
    }
}
