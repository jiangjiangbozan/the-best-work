<?php
namespace app\common\model;

// 定义一个类  

class UserData {  
    public $username;  
    public $name;  
    public $clazz_name;  
    public $school_name;  
    public $status;  
    public $role;  


    // 构造函数，用于初始化对象属性  

    public function __construct(
        $id = 0,
        $username = '', 
        $name = '', 
        $clazz_name = '', 
        $school_name = '', 
        $status = 1, 
        $role = 2
    ) {  
        $this->id = $id;  
        $this->username = $username;  
        $this->name = $name;  
        $this->clazz_name = $clazz_name;  
        $this->school_name = $school_name;  
        $this->status = $status;  
        $this->role = $role;  
    }  

} 