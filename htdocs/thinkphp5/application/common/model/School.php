<?php
namespace app\common\model;
use think\Model;

class School extends Model
{
    public function clazz()
    {
        return $this->hasMany('clazz');
    }

    public function semester()
    {
        return $this->hasMany('Semester');
    }
}