<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCrud extends Model
{
    protected $fillable = [
      'name',
      'cpf',
      'phone',
      'pass',
      'birthdate',
    ];

    public function getBirthdateAttribute($value)
    {
      return implode('/',array_reverse(explode('-',$value)));
    }

    public function setBirthdateAttribute($value)
    {
      $this->attributes['birthdate'] = implode('-',array_reverse(explode('/',$value)));
    }
}
