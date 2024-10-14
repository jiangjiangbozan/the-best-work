<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\UserData;
use app\common\model\Clazz;
use app\common\model\School;
use think\Request;
use think\Db;
use think\Controller;

class UserController extends Controller
{
    public function getUsers() {
        $users = User::all();
        $usersData = [];
        foreach($users as $user){
            $clazz = User::with('clazz')->find($user->id); 
            $clazz_id = $clazz->clazz->id;
            $school = Clazz::with('school')->find($clazz_id);
            $clazz_name = $clazz->clazz->name;
            $school_name = $school->school->name;
            $usersData[] = new UserData(
                $user->username, 
                $user->name,
                $clazz_name,
                $school_name,
                $user->status,
                $user->role
            );
        }
      return json($usersData);
    }
}