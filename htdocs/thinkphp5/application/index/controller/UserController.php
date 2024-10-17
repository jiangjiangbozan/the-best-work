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

    public function addUser() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['user']) ? $parsedData['user'] : [];
        $user = new User();
        $user->username = $data['username'];
        $user->clazz_id = $data['clazz_id'];
        $user->role = $data['role'];
        $user->name = $data['name'];
        $user->password = 123;
        $user->save();
    }

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

    public function searchUsers() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['data']) ? $parsedData['data'] : 0;
        $query = [];
        if($data['role'] !== '4' && $data['role'] !== 4){
            $query['role'] = $data['role'];
        };
        if($data['clazz_id'] !== '0' && $data['clazz_id'] !== 0){
            $query['clazz_id'] = $data['clazz_id'];
        };
        $users = User::where('name', 'like', '%' . $data['name'] . '%')
            ->where($query)->select();
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
            // var_dump($query);
            return json($usersData);
    }
}