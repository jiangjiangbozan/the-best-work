<?php
namespace app\index\controller;

use app\common\model\User;
use think\Request;
use think\Db;
use think\Controller;


class IndexController extends Controller
{
    public function index() {
    }

    public function login() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
          // 从解析后的数据中获取 username 和 password
        $username = isset($parsedData['username']) ? $parsedData['username'] : 'zhangsan';
        $password = isset($parsedData['password']) ? $parsedData['password'] : '123';
        $user = User::where('username', $username)->find();
        if(!$user){
          //根据用户名验证是否存在该用户没有返回报错信息，返回http状态码401
          return json(['error' => '没有此用户'], 401);
        }else if($user->password !== $password){
          return json(['error' => '用户名或密码不正确'], 401);
        }else{
          session('id', $user->id);
          return json([
            'username' => $user->username, 
            'password' => $user->password
        ]);
        }
    }

    public function isLogin(){
      if(session('id') !== null){
        return json(['id' => session('id')]);
      }
      return json(['error' => '当前无用户登陆'], 401);
    }

    public function logout(){
      session('id', null);
      return json(['message' => '用户已退出']);
    }
}

