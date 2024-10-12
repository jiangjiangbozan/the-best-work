<?php
namespace app\index\controller;

use app\common\model\Semester;
use app\common\model\Clazz;
use app\common\model\School;
use app\common\model\User;
use think\Request;
use think\Db;
use think\Controller;

class SemesterController extends Controller
{
    public function getSemsters() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        $clazz = User::with('clazz')->find($user_id); 
        $clazz_id = $clazz->clazz->id;
        $school = Clazz::with('school')->find($clazz_id);
        $school_id = $school->school->id;
        $semester = School::with('semester')->find($school_id);
        $semesters = [];
        foreach($semester->semester as $sem) {
            $semesters[$sem->id] = $sem->name;
        }
        return json($semesters);
    }

    public function getCurrentSemesterId() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        $clazz = User::with('clazz')->find($user_id); 
        $clazz_id = $clazz->clazz->id;
        $school = Clazz::with('school')->find($clazz_id);
        $school_id = $school->school->id;
        $semester = School::with('semester')->find($school_id);
        foreach ($semester->semester as $Semester) {
            if(!empty($Semester)){
              if (strtotime($Semester['start_time']) <= strtotime(date('Y-m-d'))) {
                if (strtotime($Semester['end_time']) >= strtotime(date('Y-m-d'))){
                    return json($Semester->id);
                }
              }
            }
        }
        return json(0);
    }
}