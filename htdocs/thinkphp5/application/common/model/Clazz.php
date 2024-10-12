<?php
namespace app\common\model;
use think\Model;

class Clazz extends Model
{
    public function user()
    {
        return $this->hasMany('user');
    }

    public function school()
    {
        return $this->belongsTo('school');
    }
}