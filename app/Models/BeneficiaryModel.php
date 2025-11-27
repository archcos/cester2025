<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeneficiaryModel extends Model
{
    use HasFactory;

    protected $table = 'tbl_beneficiaries';
    protected $primaryKey = 'beneficiary_id';

    protected $fillable = [
        'beneficiary',
        'beneficiary_leader',
        'beneficiary_leader_sex',
        'male_beneficiaries',
        'female_beneficiaries',
        'total_beneficiaries',
    ];

    // A beneficiary can have many proposals
    public function proposals()
    {
        return $this->hasMany(ProposalModel::class, 'beneficiary_id', 'beneficiary_id');
    }
}
