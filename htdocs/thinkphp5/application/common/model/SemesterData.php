<?php
namespace app\common\model;

// 定义一个类  

class SemesterData {  
    public $id;  
    public $name;  
    public $start_time;  
    public $end_time;  
    public $school_name;  


    // 构造函数，用于初始化对象属性  

    public function __construct(
        $id = 0,
        $name = '',
        $start_time = 0000-00-00, 
        $end_time =  0000-00-00,
        $school_name = '' 
    ) {  
        $this->id = $id;  
        $this->name = $name;  
        $this->start_time = $start_time;  
        $this->end_time = $end_time;  
        $this->school_name = $school_name;  
    }  

} 