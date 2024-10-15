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

    // 获取用户列表并关联班级
    public static function getUserWithClazz()
    {
        $users = User::with('clazz')->select();
        return json([
                    'code' => 0,
                    'msg' => '',
                    'data' => $users
                ]);
    }
}

