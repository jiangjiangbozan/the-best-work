<?php
namespace app\common\model;
use think\Model;

class Course extends Model
{
    public function user()
    {
        return $this->belongsTo('user');
    }

    public function semester()
    {
        return $this->belongsTo('semester');
    }
}