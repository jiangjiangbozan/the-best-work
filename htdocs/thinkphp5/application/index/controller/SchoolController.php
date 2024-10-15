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

    public function getSchools() {
        $schools = School::select();
        return json($schools);
    }

    public function index(Request $request)
    {
        // 获取分页参数
        $page = $request->param('page', 1, 'intval');
        $size = $request->param('size', 10, 'intval');
        $schoolName = $request->param('school', '');

        // 查询学校列表
        $schools = model('School')->where('name', 'like', '%' . $schoolName . '%')
                                  ->paginate($size, false, ['page' => $page]);

        // 返回数据
        return json([
            'code' => 0,
            'msg' => '',
            'data' => $schools->items(),
            'total' => $schools->total()
        ]);
    }
}