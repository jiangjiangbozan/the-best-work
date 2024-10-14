<?php
namespace app\common\model;
use think\Model;

class User extends Model
{
    public function course()
    {
        return $this->hasMany('course');
    }

    public function clazz()
    {
        return $this->belongsTo('clazz');
    }

    public function getUsers() {
        $users = User::all();
        var_dump($suers);
    }
}

