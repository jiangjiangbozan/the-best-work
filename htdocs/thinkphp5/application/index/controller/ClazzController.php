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
        return json($clazzAndSchools);
    
        
    }

    public function index(Request $request)
        {
            $page = $request->param('page', 1);
            $size = $request->param('size', 10);
            $schoolId = $request->param('school_id', '');
            $clazz = $request->param('clazz', '');

            // 构建查询
            $query = Clazz::with('school');

            if (!empty($schoolId)) {
                $query = $query->where('school_id', $schoolId);
            }

            if (!empty($clazz)) {
                $query = $query->where('clazz.name', 'like', "%{$clazz}%");
            }

            // 分页查询
            $result = $query->paginate($size, false, ['page' => $page]);

            // 处理返回的数据格式
            $data = [];
            foreach ($result as $clazzInstance) {
                $data[] = [
                    'id' => $clazzInstance->id,
                    'name' => $clazzInstance->name,
                    'schoolId' => $clazzInstance->school_id,
                    'schoolName' => $clazzInstance->school ? $clazzInstance->school->name : '',
                ];
            }

            return json([
                'data' => $data,
                'total' => $result->total(),
                'currentPage' => $result->currentPage(),
                'lastPage' => $result->lastPage(),
                'perPage' => $result->listRows(),
            ]);
        }

    public function add(Request $request)
    {
        // 获取原始的 POST 数据
        $postData = file_get_contents('php://input');

        // 将 JSON 数据解析为 PHP 对象或数组
        $data = json_decode($postData, true);

        // 检查 JSON 是否正确解析
        if (json_last_error() !== JSON_ERROR_NONE) {
            return json(['status' => 'fail', 'error' => 'Invalid JSON format']);
        }

        // 检查必要字段是否存在
        if (!isset($data['schoolId']) || !isset($data['name'])) {
            return json(['status' => 'fail', 'error' => 'Missing required fields']);
        }

        // 插入数据到数据库
        $result = Db::name('clazz')->insert([
            'school_id' => $data['schoolId'],
            'name' => $data['name']
        ]);

        if ($result) {
            return json(['status' => 'success']);
        } else {
            return json(['status' => 'fail', 'error' => 'Failed to insert data']);
        }
    }

    public function delete(Request $request)
        {
            $id = $request->param('id');
            // 确保请求方法是 DELETE
            if ($request->isDelete()) {
                // 实例化模型
                $clazz = Clazz::find($id);

                // 检查学校是否存在
                if ($clazz) {
                    // 删除学校
                    if ($clazz->delete()) {
                        return json(['status' => 'success', 'message' => 'clazz deleted successfully']);
                    } else {
                        return json(['status' => 'error', 'message' => 'Failed to delete clazz'], 500);
                    }
                } else {
                    return json(['status' => 'error', 'message' => 'Clazz not found'], 404);
                }
            } else {
                return json(['status' => 'error', 'message' => 'Invalid request method'], 405);
            }
        }

    public function checkNameExists()
    {
        // 获取原始的 POST 数据
        $postData = file_get_contents('php://input');

        // 将 JSON 数据解析为 PHP 对象或数组
        $data = json_decode($postData, true);

        if (!isset($data['name'])) {
            return json(['exists' => false, 'error' => '缺少必要的参数']);
        }

        $name = $data['name'];
        $exists = Db::name('clazz')->where('name', $name)->find();

        if ($exists) {
            return json(['exists' => true]);
        } else {
            return json(['exists' => false]);
        }
    }

    public function update(Request $request)
    {
        // 获取URL参数中的班级ID
        $clazzId =$request->param('id');
        if (!$clazzId) {
            return json(['status' => 'fail', 'message' => '班级ID未提供！']);
        }

        // 获取请求体中的数据
        $postData = file_get_contents('php://input');
        $data = json_decode($postData, true);

        // 检查数据是否有效
        if (!$data || !isset($data['name']) || !isset($data['schoolId'])) {
            return json(['status' => 'fail', 'message' => '无效的数据格式！']);
        }

        // 获取班级名称和学校ID
        $name =$data['name'];
        $schoolId =$data['schoolId'];

        // 执行数据库更新操作
        $result = Db::name('clazz')
            ->where('id', $clazzId)
            ->update(['name' => $name, 'school_id' =>$schoolId]);

        // 检查更新结果
        if ($result) {
            return json(['status' => 'success', 'message' => '班级信息更新成功！']);
        } else {
            // 尝试查找记录以确认是否存在
            $existingClazz = Db::name('clazz')->find($clazzId);
            if ($existingClazz) {
                // 记录存在但未更新，可能是因为字段值没有变化或其他数据库约束
                return json(['status' => 'fail', 'message' => '尽管记录存在，但更新班级信息失败，请检查字段值和数据库约束！']);
            } else {
                // 记录不存在
                return json(['status' => 'fail', 'message' => '未找到要更新的班级记录，请检查ID是否正确！']);
            }
        }
    }
}