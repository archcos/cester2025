<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProponentModel extends Model
{
    use HasFactory;

    protected $table = 'tbl_proponents';
    protected $primaryKey = 'proponent_id';

    protected $fillable = [
        'proponent_name',
        'sex',
    ];

    // A proponent can have many proposals
    public function proposals()
    {
        return $this->hasMany(ProposalModel::class, 'proponent_id', 'proponent_id');
    }
}
