<?php
namespace app\index\controller;

use app\common\model\User;
use think\Request;
use think\Db;
use think\Controller;

class PersonalcenterController extends Controller
{
    public function getUserInfo()
    {
        $id = session('id');
        if ($id === null) {
            return json(['error' => '用户未登录'], 401);
        }
        $user = User::find($id);
        if ($user) {
            return json($user);
        } else {
            return json(['error' => '找不到用户'], 404);
        }
    }

    public function changePassword(Request $request)
    {
        if ($request->isPost()) {
            // 获取原始的 POST 数据
            $postData = file_get_contents('php://input');

            // 将 JSON 数据解析为 PHP 对象或数组
            $data = json_decode($postData, true);

            $userId = $request->param('id');

            // 获取当前用户
            $user = User::where('id', $userId)->find();

            // 验证当前密码是否正确
            if ($data['currentPassword'] !== $user->password) {
                return json(['status' => 'error', 'msg' => '当前密码不正确']);
            }

            // 哈希新密码
//             $hashedNewPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);

            // 更新密码（存储哈希值）
            $user->password = $data['newPassword'];

            try {
                $result = $user->save();
            } catch (\Exception $e) {
                return json(['status' => 'error', 'msg' => '数据库错误: ' . $e->getMessage()]);
            }

            // 返回结果
            if ($result) {
                return json(['status' => 'success', 'msg' => '密码更新成功']);
            } else {
                return json(['status' => 'error', 'msg' => '密码更新失败']);
            }
        } else {
            return json(['status' => 'error', 'msg' => '请求方法错误']);
        }
    }

    public function getUserList()
    {
            $users = User::getUserWithClazz();
            return $users;
    }
}