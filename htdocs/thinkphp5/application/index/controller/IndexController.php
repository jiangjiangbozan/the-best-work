<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\UserSessions;
use think\Request;
use think\Db;
use think\Controller;


class IndexController extends BaseController
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
  public function login() {
      // 解析 JSON 数据
      $parsedData = json_decode(Request::instance()->getContent(), true);
        // 从解析后的数据中获取 username 和 password
      $username = isset($parsedData['username']) ? $parsedData['username'] : 'zhangsan';
      $password = isset($parsedData['password']) ? $parsedData['password'] : '123';
      $user = User::where('username', $username)->find();
      if(!$user){
        //根据用户名验证是否存在该用户没有返回报错信息，返回http状态码401
        return json(['error' => '没有此用户'], 401);
      }else if($user->password !== $password){
        return json(['error' => '用户名或密码不正确'], 401);
      }else if($user->status === 0) {
        return json(['error' => '您的账号已被冻结，请联系管理员'], 401);
      }else if(UserSessions::where('user_id', $user->id)->find()) {
        return json(['error' => '用户已在别处登录'], 401);
      }else{
        $user_session = new UserSessions();
        $user_session->user_id = $user->id;
        $user_session->token = md5($user->username);
        $user_session->create_time = date('Y-m-d H:i:s', time());
        $user_session->cut_down_time = date('Y-m-d H:i:s', time() + 86400);
        $user_session->save();
        header('x-auth-token' . $user_session->token);
        return json([
          'role' => $user->role,
          'user_id' => $user->id,
          'message' => '成功登录',
          'token' => $user_session->token
        ]);
      }
    }

    public function isLogin(){
      if(!$this->request->header('x-auth-token')) {
        return json(['error' => '当前无用户登陆'], 401);
      }else {
        $token = $this->request->header('x-auth-token');
        $user_session = UserSessions::where('token', $token)->find();
        $id = $user_session->user_id;
      }
      if($id !== null){
        return $id;
      }
    
    }

    public function logout(){
      $user_session = UserSessions::where('user_id', $this->getUserId())->find();
      $user_session->delete();
      session('id', null);
      return json([
        'message' => '用户已退出'
      ]);
    }

    public function getUser() {
      $parsedData = json_decode(Request::instance()->getContent(), true);
      $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;

      if($user_id === 0) {
        $token = $this->request->header('x-auth-token');
        $user_session = UserSessions::where('token', $token)->find();
        $id = $user_session->user_id;
      }else {
        $id = $user_id;
      }

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

    public function getUserRole() {
      //获取当前登录用户信息
      $user = User::get($this->getUserId());
      $role = $user->role;
      return json($role);
    }

    public function dingTalkSchedule(Request $request)
        {
            // 获取请求中的令牌
            $token =$request->param('token');

            // 创建 PublicScheduleController 实例
            $publicScheduleController = new PublicScheduleController();

            // 调用 showScheduleWithToken 方法并返回结果
            return $publicScheduleController->showScheduleWithToken($token);
        }
}
