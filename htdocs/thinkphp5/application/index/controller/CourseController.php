<?php
namespace app\index\controller;

use app\common\model\Course;
use think\Request;
use think\Db;
use think\Controller;

class CourseController extends Controller
{
    public function index() {
    }

    public function getCourses() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        // 从解析后的数据中获取 user_id
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;

        $user = Course::where('user_id', $user_id)->select();

        return json($user);
    }

}