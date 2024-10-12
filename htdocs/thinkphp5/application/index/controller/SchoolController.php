<?php
namespace app\index\controller;
use app\common\model\School;
use app\common\model\Clazz;
use app\common\model\User;
use think\Request;
use think\Db;
use think\Controller;

class SchoolController extends Controller
{
    public function getCurrentSchoolName() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        $clazz = User::with('clazz')->find($user_id); 
        $clazz_id = $clazz->clazz->id;
        $school = Clazz::with('school')->find($clazz_id);
        return json($school->school->name);
    }
}