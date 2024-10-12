<?php
namespace app\index\controller;

use app\common\model\Clazz;
use app\common\model\User;
use think\Request;
use think\Db;
use think\Controller;

class ClazzController extends Controller
{
    public function getCurrentClazzName() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        $clazz = User::with('clazz')->find($user_id); 
        return json($clazz->clazz->name);
    }
}