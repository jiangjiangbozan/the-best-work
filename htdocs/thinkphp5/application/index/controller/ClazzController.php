<?php
namespace app\index\controller;

use app\common\model\Clazz;
use app\common\model\School;
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

    public function getClazzAndSchool() {
        $clazzes = Clazz::all();
        $clazzAndSchools = array();

        foreach($clazzes as $clazz) {
            $clazzAndSchool = [];
            $school = Clazz::with('school')->find($clazz->id);
            $clazzAndSchool['clazz_name'] = $clazz->name; 
            $clazzAndSchool['school_name'] = $school->school->name; 
            $clazzAndSchool['id'] = $clazz->id; 
            $clazzAndSchools[] = $clazzAndSchool;
        }
        // var_dump($clazzAndSchools);
        return json($clazzAndSchools);
    
        
    }

    public function index(Request $request)
        {
            // 获取分页参数
            $page = $request->param('page', 1, 'intval');
            $size = $request->param('size', 10, 'intval');
            $schoolId = $request->param('school_id', '');
            $clazz = $request->param('clazz', '');

            // 查询班级列表
            $clazzes = model('Clazz')->where(function ($query) use ($schoolId, $clazz) {
                $query->when($schoolId, function ($query) use ($schoolId) {
                    $query->where('school_id', $schoolId);
                })->when($clazz, function ($query) use ($clazz) {
                    $query->where('clazz', 'like', '%' . $clazz . '%');
                });
            })->paginate($size, false, ['page' => $page]);

            // 返回数据
            return json([
                'code' => 0,
                'msg' => '',
                'data' => $clazzes->items(),
                'total' => $clazzes->total()
            ]);
        }
}