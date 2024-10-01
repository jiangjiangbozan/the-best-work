<?php
namespace app\index\controller;
use think\Request;
use think\Controller;
use think\Db;
use app\common\model\User;

class PersonalCenterController extends IndexController
{
    public function index()
    {
        $id = session('id');
        // $user = User::get($id);
        $user = User::join('yunzhi_clazz','yunzhi_user.clazz_id = yunzhi_clazz.id')
        ->join('yunzhi_school','yunzhi_clazz.school_id = yunzhi_school.id')
        ->field('yunzhi_clazz.id as clazz_id, yunzhi_school.id as school_id, yunzhi_user.id as user_id, yunzhi_user.*, yunzhi_clazz.*, yunzhi_school.*')
        ->where('yunzhi_user.id', 'like', '%' . $id . '%')
        ->find();
        $this->assign('user',$user);
        return $this->fetch();
    }


    public function changePassword(Request $request)
    {
        if ($request->isPost()) {
            $postData = $request->post();

            // 验证所有字段是否填写
            if (empty($postData['currentPassword']) || empty($postData['newPassword']) || empty($postData['confirmNewPassword'])) {
                return json(['status' => 'error', 'msg' => '请完整填写表格']);
            }

            // 获取当前用户
            $user = User::where('id', session('id'))->find();

            // 验证当前密码是否正确
            if (!password_verify($postData['currentPassword'], $user->password)) {
                return json(['status' => 'error', 'msg' => '当前密码不正确']);
            }

            // 验证两次输入的新密码是否一致
            if ($postData['newPassword'] !== $postData['confirmNewPassword']) {
                return json(['status' => 'error', 'msg' => '两次输入的新密码不一致']);
            }

            // 哈希新密码
            $hashedNewPassword = password_hash($postData['newPassword'], PASSWORD_DEFAULT);

            // 更新密码（存储哈希值）
            $user->password = $hashedNewPassword;

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

    public function getUser($userId)
    {
        $user = User::find($userId);
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['message' => '找不到用户'], 404);
        }
    }

    public function updatePassword($userId, Request $request)
    {
        $user = User::find($userId);
        if ($user && password_verify($request->input('old_password'), $user->password)) {
            $user->password = password_hash($request->input('new_password'), PASSWORD_DEFAULT);
            if ($user->save()) {
                return response()->json(['message' => 'Password updated successfully']);
            } else {
                return response()->json(['message' => 'Failed to update password'], 500);
            }
        } else {
            return response()->json(['message' => 'Invalid old password or user not found'], 400);
        }
    }


}
?>