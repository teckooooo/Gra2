<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ejecutivo extends Model
{
    public $timestamps = false;

    protected $fillable = ['nombre', 'activo'];
}
