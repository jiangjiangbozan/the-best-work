<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\UserSessions;
use app\common\model\UserData;
use app\common\model\Clazz;
use app\common\model\School;
use think\Request;
use think\Db;
use think\Controller;

class UserController extends Controller
{

    public function getUserId() {  
        // 假设从请求获取 id  
        if(!$this->request->header('x-auth-token')) {
        // return json(['error' => '当前无用户登陆'], 401);
        }else {
        $token = $this->request->header('x-auth-token');
        $user_session = UserSessions::where('token', $token)->find();
        return $user_session->user_id;
        }
    } 
    public function addUser() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['user']) ? $parsedData['user'] : [];
        if(User::where('username', $data['username'])->find()){
            return json(['error' => '用户名重复'], 401);
        }else{
            $user = new User();
            $user->username = $data['username'];
            $user->clazz_id = $data['clazz_id'];
            $user->role = $data['role'];
            $user->name = $data['name'];
            $user->status = 1;
            $user->password = 123;
            $user->save();
        }
    }

    public function changeStatus() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : [];
        $changeStatus = isset($parsedData['changeStatus']) ? $parsedData['changeStatus'] : [];
        $user = User::find($user_id);
        $user->status = $changeStatus;
        $user->save();
    }
     
    public function deleteUser() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : [];
        $user = User::where('id', $user_id)->find();
        $user->delete();
    }

    public function getCuurentUser() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = $this->getUserId();
        $user = User::find($user_id);
        return json([
            'username' => $user->username,
            'name' => $user->name,
            'clazz_id' => $user->clazz_id,
            'role' => $user->role
        ]);
    }
    public function getUser() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        if($user_id === 0) {
            $user_id = $this->getUserId();
        }
      

        $user = User::find($user_id);
        return json([
            'username' => $user->username,
            'name' => $user->name,
            'clazz_id' => $user->clazz_id,
            'role' => $user->role
        ]);
    }

    public function getUsers() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $pageData = isset($parsedData['pageData']) ? $parsedData['pageData'] : [];
        if(empty($pageData)){
            $users = User::all();
        }else{
            $size = $pageData['size'];
            $currentPage = $pageData['currentPage'];
            $offset = ($currentPage - 1) * $size;
            $users = User::limit($offset, $size)->select();
        }
        $usersData = [];
        foreach($users as $user){
            $clazz = User::with('clazz')->find($user->id); 
            $clazz_id = $clazz->clazz->id;
            $school = Clazz::with('school')->find($clazz_id);
            $clazz_name = $clazz->clazz->name;
            $school_name = $school->school->name;
            $usersData[] = new UserData(
                $user->id,
                $user->username, 
                $user->name,
                $clazz_name,
                $school_name,
                $user->status,
                $user->role
            );
            $tolalElementsOfData = count(User::all());
        }
      return json([
        'users' => $usersData,
        'tolalElementsOfData' => $tolalElementsOfData
      ]);
    }

    public function updateUser() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $userData = isset($parsedData['user']) ? $parsedData['user'] : [];
        $user = User::get($userData['id']);
        $sameUsernameUsers = User::where('username', $userData['username'])->select();
        if(count($sameUsernameUsers) !== 0) {
            foreach($sameUsernameUsers as $user ) {
                if($user !== $userData['id']){
                    return json(['error' => '用户名重复'], 401);
                }
            }
           
        }else{
            $user->username = $userData['username'];
            $user->name = $userData['name'];
            $user->clazz_id = $userData['clazz_id'];
            $user->role = $userData['role'];
            $user->save();
            
        }

    }

    public function searchUsers() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['data']) ? $parsedData['data'] : 0;
        $query = [];
        if($data['role'] !== '4' && $data['role'] !== 4){
            $query['role'] = $data['role'];
        };
        if($data['clazz_id'] !== '0' && $data['clazz_id'] !== 0){
            $query['clazz_id'] = $data['clazz_id'];
        };
        $size = $data['size'];
        $currentPage = $data['currentPage'];
        $offset = ($currentPage - 1) * $size;
        $users = User::where('name', 'like', '%' . $data['name'] . '%')
            ->where($query)
            ->limit($offset, $size)
            ->select();
            $usersData = [];
            foreach($users as $user){
                $clazz = User::with('clazz')->find($user->id); 
                $clazz_id = $clazz->clazz->id;
                $school = Clazz::with('school')->find($clazz_id);
                $clazz_name = $clazz->clazz->name;
                $school_name = $school->school->name;
                $usersData[] = new UserData(
                    $user->id,
                    $user->username, 
                    $user->name,
                    $clazz_name,
                    $school_name,
                    $user->status,
                    $user->role
                );
            }
            $tolalElementsOfData = count(User::where('name', 'like', '%' . $data['name'] . '%')->select());
            // var_dump($user->name);
            return json([
                'users' => $usersData,
                'tolalElementsOfData' => $tolalElementsOfData
              ]);
    }

    public function resetPassword(Request $request)
    {
        // 验证用户ID
        $userId =$request->param('id');
        $user = User::where('id',$userId)->find();
        if (!$user) {
            return json(['error' => '用户不存在'], 404);
        }

        // 检查密码是否已经是 '123'
        if ($user->password === '123') {
            return json(['error' => '密码已经是默认密码，无需重置'], 400);
        }

        // 更新密码为123，实际应用中应使用更安全的密码处理方式
        $user->password = '123';
        if ($user->save()) {
            return json(['success' => '密码重置成功']);
        } else {
            return json(['error' => '密码重置失败'], 500);
        }
    }
}