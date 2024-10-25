<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\UserData;
use app\common\model\Clazz;
use app\common\model\School;
use app\common\model\Semester;
use app\common\model\Course;
use think\Request;
use think\Db;
use think\Controller;

class ScheduleController extends Controller
{
    public function getfirstDayOfCurrentWeek() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $date = isset($parsedData['date']) ? $parsedData['date'] : [];
        // 将日期转换为时间戳  
        $timestamp = strtotime($date);
        $firstDayOfCurrentWeek = $this->changeToMonday($timestamp);
        return json($firstDayOfCurrentWeek);
    }

    public function getUnbusyStudentsOfCurrentWeek() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $date = isset($parsedData['date']) ? $parsedData['date'] : [];
        // 将日期转换为时间戳  
        $timestamp = strtotime($date);
        $semesters = Semester::all();
        $UnbusyStudentsOfCurrentWeek = array();
        // $UnbusyStudentsOfCurrentWeek[0]['time'] = '1-1';
        // $UnbusyStudentsOfCurrentWeek[0]['students'][] = 'zhangsan';

        foreach($semesters as $semester) {
            if((strtotime($semester['start_time']) <= $timestamp)&& (strtotime($semester['end_time']) >= $timestamp)) {
                $Semester = Semester::with('school')->find($semester['id']);
                $clazzes =  School::get($Semester->school->id)->clazz()->select();
                
                //将该学期的开始时间记录为该星期的星期一的日期字符串
                $start_time = $this->changeToMonday(strtotime($Semester->start_time));
                //计算当前星期和当前学期开始星期的偏移量,查询时应该加一
               $weekOffset = floor(($timestamp - strtotime($start_time)) / (60 * 60 * 24 * 7));
                foreach($clazzes as $clazz) {
                    $users =  Clazz::get($clazz->id)->user()->select();
                    foreach($users as $user) {
                        $courses = Course::where([
                            'semester_id' => $Semester->id,
                            'user_id' => $user['id'],
                        ])->where('start_week', '<=', $weekOffset + 1)
                        ->where('end_week', '>=', $weekOffset + 1)
                        ->select();
                        if(count($courses) !== 0) {
                            foreach($courses as $course) {
                                $time = (string)$course['date']. '-'.(string)$course['section'];
                                $studentData = [
                                    'name' => $user['name'],
                                    'time' => $time
                                ];
                                // 检查是否已经存在具有相同 time 的条目，如果不存在则创建  
                                $found = false;
                                foreach ($UnbusyStudentsOfCurrentWeek as &$entry) {  
                                    if ($entry['time'] == $studentData['time']) {  
                                        $entry['students'][] = $studentData['name'];  
                                        $found = true;  
                                        break;  
                                    }  
                                }  
                    
                                if (!$found) {  
                                    $UnbusyStudentsOfCurrentWeek[] = [
                                        'time' => $studentData['time'],  
                                        'students' => [$studentData['name']]  
                                    ];  
                                }  
                            }
                        }
                
                    }
                }
            }
        }
            return  json($UnbusyStudentsOfCurrentWeek);       
        
    }

    public function changeToMonday($timestamp) {
        $dayOfWeekNumber = date('w', $timestamp);  
         // 使用 switch 语句来判断星期几  然后转化为当前星期的星期一
         switch ($dayOfWeekNumber) {  
            case 0:  
                $firstDayOfCurrentWeek = $timestamp - 86400 * 6;  
                break;  
            case 1:  
                $firstDayOfCurrentWeek = $timestamp;  
                break;  
            case 2:  
                $firstDayOfCurrentWeek = $timestamp - 86400 * 1;  
                break;  
            case 3:  
                $firstDayOfCurrentWeek = $timestamp - 86400 * 2;  
                break;  
            case 4:  
                $firstDayOfCurrentWeek = $timestamp - 86400 * 3;  
                break;  
            case 5:  
                $firstDayOfCurrentWeek = $timestamp - 86400 * 4;  
                break;  
            case 6:  
                $firstDayOfCurrentWeek = $timestamp - 86400 * 5;  
                break;  
            default:  
                $firstDayOfCurrentWeek = $timestamp;  
                break;  
        }  
        $dateString = date('Y-m-d', $firstDayOfCurrentWeek); 
        return $dateString;
    }
}