<?php
namespace app\index\controller;

use app\common\model\Semester;
use app\common\model\SemesterData;
use app\common\model\Clazz;
use app\common\model\School;
use app\common\model\User;
use think\Request;
use think\Db;
use think\Controller;

class SemesterController extends Controller
{
    public function addSemester() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['data']) ? $parsedData['data'] : [];
        if(Semester::where('name', $data['semester_name'])->find()){
            return json(['error' => '学期名重复'], 401);
        };
        if(strtotime($data['end_time']) < strtotime($data['start_time'])){
            return json(['error' => '起始时间大于结束时间'], 401);
        } 

        $sameSemester = Semester::where('school_id', $data['school_id'])->select();
        if(!empty($sameSemester)){
            foreach ($sameSemester as $semester) {
                if (strtotime($data['end_time']) < strtotime($semester['start_time']) || strtotime($data['start_time']) > strtotime($semester['end_time'])) {
                    continue;
                }else{
                    return json(['error' => '新学期的日期选择和之前已有的学期所包含的日期有重叠部分，请重新选择'], 401);
                }
              }
        }
        $semester = new Semester();
        $semester->start_time = $data['start_time'];
        $semester->name = $data['semester_name'];
        $semester->school_id = $data['school_id'];
        $semester->end_time = $data['end_time'];
        $semester->save();
    }

    public function changeToMonday($timestamp) {
        //传入时间戳
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

    public function delectSemster() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $id = isset($parsedData['id']) ? $parsedData['id'] : 0;
        $semester = Semester::get($id, 'course');
        $semester->course()->delete();
        $semester->delete();
    }
 
    public function getAllSemsters() {
        $Semesters = Semester::all();
        $allSemesters = [];
        foreach($Semesters as $Semester) {
            $Semester = Semester::with('school')->find($Semester['id']);
            $allSemesters[] = new SemesterData(
                $Semester->id,
                $Semester->name,
                $Semester->start_time,
                $Semester->end_time,
                $Semester->school->name
            );
        }
        return json($allSemesters);
    }

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

    public function getSemster() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $semester_id = isset($parsedData['semester_id']) ? $parsedData['semester_id'] : 0;
        if($semester_id != 0){
            $semester = Semester::get($semester_id);
            return json($semester);
        }
       
    }

    public function getCurrentSemesterTotalWeek() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $semester_id = isset($parsedData['semesterId']) ? $parsedData['semesterId'] : 0;
        if($semester_id != 0) {
            $semester = Semester::find($semester_id);
            $start_time = $this->changeToMonday(strtotime($semester->start_time));
            $totalWeek = ceil((strtotime($semester->end_time) - strtotime($start_time)) / (60 * 60 * 24 * 7));
            return json($totalWeek);
        }
       
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

    public function index(Request $request)
        {
            // 获取分页参数
            $page = $request->param('currentPage', 1, 'intval');
            $size = $request->param('pageSize', 10, 'intval');
            $schoolId = $request->param('school_id', '');
            $semester = $request->param('semester', '');

            // 获取学校列表用于下拉选择
            $schools = School::all();

            // 查询学期列表
            $query = Semester::with(['school'])
                          ->where(function ($query) use ($schoolId, $semester) {
                              if ($schoolId) {
                                  $query->where('school_id', $schoolId);
                              }
                              if ($semester) {
                                  $query->where('semester', 'like', "%{$semester}%");
                              }
                          })
                          ->order('id', 'desc');

            $semesters = $query->paginate($size, false, ['page' => $page]);

            // 返回数据
            return json([
                'code' => 0,
                'msg' => '',
                'data' => $semesters->items(),
                'total' => $semesters->total(),
                'schools' => $schools
            ]);
        }

        public function searchSemsters() {
            $parsedData = json_decode(Request::instance()->getContent(), true);
            $data = isset($parsedData['data']) ? $parsedData['data'] : 0;
            $query = [];
            if((int)$data['school_id'] !== 0){
                $query['school_id'] = $data['school_id'];
            };
            $size = $data['size'];
            $currentPage = $data['currentPage'];
            $offset = ($currentPage - 1) * $size;
            $semesters = Semester::where('name', 'like', '%' . $data['semester_name'] . '%')
                ->where($query)
                ->limit($offset, $size)
                ->select();
                $semestersData = [];
                foreach($semesters as $Semester) {
                    $Semester = Semester::with('school')->find($Semester['id']);
                    $semestersData[] = new SemesterData(
                        $Semester->id,
                        $Semester->name,
                        $Semester->start_time,
                        $Semester->end_time,
                        $Semester->school->name
                    );
                }
                $allSemesters = Semester::where('name', 'like', '%' . $data['semester_name'] . '%')
                ->where($query)
                ->select();
                $tolalElementsOfData = count($allSemesters);
                // var_dump($query);
                return json([
                    'semesters' => $semestersData,
                    'tolalElementsOfData' => $tolalElementsOfData
                  ]);
        }

        public function updateSemster() {
            $parsedData = json_decode(Request::instance()->getContent(), true);
            $data = isset($parsedData['data']) ? $parsedData['data'] : [];
            $Semester =Semester::where('name', $data['semester_name'])->find();
            if(!empty($Semester) && ((int)$data['id'] !== $Semester->id)){
                return json(['error' => '学期名重复'], 401);
            };

            if(strtotime($data['end_time']) < strtotime($data['start_time'])){
                return json(['error' => '起始时间大于结束时间'], 401);
            };
    
            $sameSemester = Semester::where('school_id', $data['school_id'])->select();
            if(!empty($sameSemester)){
                foreach ($sameSemester as $semester) {
                    //排除当前学期
                    if($semester->id === (int)$data['id']) {
                        break;
                    }
                    if (strtotime($data['end_time']) < strtotime($semester['start_time']) || strtotime($data['start_time']) > strtotime($semester['end_time'])) {
                        continue;
                    }else{
                        return json(['error' => '新学期的日期选择和之前已有的学期所包含的日期有重叠部分，请重新选择'], 401);
                    }
                  }
            }
            $semester = Semester::get($data['id']);
            $semester->start_time = $data['start_time'];
            $semester->name = $data['semester_name'];
            $semester->school_id = $data['school_id'];
            $semester->end_time = $data['end_time'];
            $semester->save();
        }
}