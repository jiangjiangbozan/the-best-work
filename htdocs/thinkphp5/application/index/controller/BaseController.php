<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\UserSessions;
use think\Request;
use think\Db;
use think\Controller;


class BaseController extends Controller
{
    protected $id = 0;  

    public function initialize()  

    {  
        var_dump($this->request);
        die();
        // 假设从请求获取 id  
        if(!$this->request->header('x-auth-token')) {
            return json(['error' => '当前无用户登陆'], 401);
          }else {
            $token = $this->request->header('x-auth-token');
            $user_session = UserSessions::where('token', $token)->find();
            $this->$id = $user_session->user_id;
           
          }
    } 
}