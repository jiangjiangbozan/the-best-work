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
    public function add(Request $request)
    {
        // 获取原始的 POST 数据
        $postData = file_get_contents('php://input');

        // 将 JSON 数据解析为 PHP 对象或数组
        $data = json_decode($postData, true);

        // 获取 'name' 字段，确保它存在
        if (isset($data['name'])) {
            $name = trim($data['name']);

            // 实例化模型
            $school = new School();

            // 填充数据
            $school->name = $name;

            // 保存到数据库
            if ($school->save()) {
                return json(['status' => 'success', 'message' => 'School added successfully']);
            } else {
                // 如果保存失败，获取错误信息
                $error = $school->getError();
                return json(['status' => 'error', 'message' => 'Failed to add school: '. $error], 500);
            }
        } else {
            // 如果 'name' 字段不存在，返回错误
            return json(['status' => 'error', 'message' => 'Name field is missing'], 400);
        }
    }

    public function getCurrentSchool() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        $clazz = User::with('clazz')->find($user_id); 
        $clazz_id = $clazz->clazz->id;
        $school = Clazz::with('school')->find($clazz_id);
        return json([
            'school_name' => $school->school->name,
            'school_id' => $school->school->id
        ]);
    }

    public function getSchools()
    {
        $schools = School::select();
        return json($schools);
    }

    public function index(Request $request)
    {
        // 获取分页参数
            $page =$request->param('page/d', 1);
            $size =$request->param('size/d', 10);
            $schoolName =$request->param('schoolName', '');

            // 构建查询条件
            $query = Db::name('school')
                    ->where('name', 'like', '%' . $schoolName . '%')
                    ->select();
            $querys = Db::name('school')
                      ->where('name', 'like', '%' . $schoolName . '%');

            // 计算总数
            $total =$querys->count();

            // 获取分页数据
            $schools =$query;

            // 构建响应数据
            $results = [
                'data' => $schools,
                'total' => $total
            ];

            // 返回JSON响应
            return json($results);
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
        $exists = Db::name('school')->where('name', $name)->find();

        if ($exists) {
            return json(['exists' => true]);
        } else {
            return json(['exists' => false]);
        }
    }

    public function delete(Request $request)
    {
        $id =$request->param('id');

        // 确保请求方法是 DELETE
        if ($request->isDelete()) {
            // 实例化模型
            $school = School::find($id);

            // 检查学校是否存在
            if ($school) {
                // 获取属于该学校的班级ID
                $clazzIds = Clazz::where('school_id',$id)->column('id');
                Clazz::where('school_id', 'in', $id)->delete();

                // 删除属于这些班级的用户
                if (!empty($clazzIds)) {
                    User::where('clazz_id', 'in', $clazzIds)->delete();
                }

                // 删除学校
                if ($school->delete()) {
                    return json(['status' => 'success', 'message' => 'School and associated users deleted successfully']);
                } else {
                    return json(['status' => 'error', 'message' => 'Failed to delete school'], 500);
                }
            } else {
                return json(['status' => 'error', 'message' => 'School not found'], 404);
            }
        } else {
            return json(['status' => 'error', 'message' => 'Invalid request method'], 405);
        }
    }

    public function updateSchool(Request $request)
    {
        $postData = file_get_contents('php://input');
        $data = json_decode($postData, true);

        $id = $request->param('id');

        if (!isset($data['name'])) {
            return json(['success' => false, 'message' => '缺少必要的参数']);
        }

        $name = $data['name'];

        $school = Db::name('school')->find($id);

        if (!$school) {
            return json(['success' => false, 'message' => '学校不存在']);
        }

        if (Db::name('school')->where('id', $id)->update(['name' => $name])) {
            return json(['success' => true, 'message' => '更新成功']);
        } else {
            return json(['success' => false, 'message' => '更新失败']);
        }
    }
}