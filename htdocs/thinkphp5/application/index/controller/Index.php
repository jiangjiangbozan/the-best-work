<?php
namespace app\index\controller;

use app\index\model\User;
use think\Request;

class Index
{
    public function index() {
      return 1;
    }

    public function login() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
          // 从解析后的数据中获取 username 和 password
        $username = isset($parsedData['username']) ? $parsedData['username'] : 'zhangsan';
        $password = isset($parsedData['password']) ? $parsedData['password'] : '123';
        $user = new User();

        $user->setUsername($username);
        $user->setPassword($password);
        return json($user->toArray());
    }
}

