<?php
namespace app\common\model;
use think\Model;

class Semester extends Model
{
    public function course()
    {
        return $this->hasMany('course');
    }

    public function school()
    {
        return $this->belongsTo('school');
    }
}