<?php
namespace app\index\controller;

use app\common\model\Course;
use think\Request;
use think\Db;
use think\Controller;

class CourseController extends Controller
{
    public function addCourse() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $course = isset($parsedData['course']) ? $parsedData['course'] : [];
        $newCourse = new Course;
        $newCourse->user_id = $course['user_id'];
        $newCourse->name = $course['name'];
        $newCourse->date = $course['date'];
        $newCourse->start_week = $course['start_week'];
        $newCourse->end_week = $course['end_week'];
        $newCourse->section = $course['section'];
        $newCourse->semester_id = $course['semester_id'];
        $sameWeek = Course::where([
            'date' => $course['date'],
            'section' => $course['section'],
            'user_id' => $course['user_id'],
            'semester_id' => $course['semester_id']
            ])->select();
        if(!empty($sameWeek)){
            foreach ($sameWeek as $courses) {
                if ($course['end_week'] < $courses['start_week'] || $course['start_week'] > $courses['end_week']) {
                    continue;
                }else if($course['id'] === $courses['id']){
                    continue;
                }else{
                    return json(['error' => '课程日期选择失败'], 401);
                }
              }
        }
        $newCourse->save();
        return json(['success' => '新增课程成功']);
    }

    public function delectCourse() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        // 从解析后的数据中获取 user_id
        $id = isset($parsedData['id']) ? $parsedData['id'] : 0;
        $course = Course::where('id', $id)->find();
        $course->delete();
        return json(['success' => '删除课程成功']);
    }

    public function getCourses() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        // 从解析后的数据中获取 user_id
        $data = isset($parsedData['data']) ? $parsedData['data'] : [];
        $courses = Course::where([
            'user_id' => $data['user_id'],
            'semester_id' => $data['semester_id']
            ])->select();
        return json($courses);
    }

    public function getCourse() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        // 从解析后的数据中获取 user_id
        $id = isset($parsedData['id']) ? $parsedData['id'] : 0;
        $course = Course::where('id', $id)->find();
        return json($course);
    }

    public function updateCourse() {

         // 解析 JSON 数据
         $parsedData = json_decode(Request::instance()->getContent(), true);
         $course = isset($parsedData['course']) ? $parsedData['course'] : [];
         if((int)$course['end_week'] < (int)$course['start_week']){
            return json(['error' => '起始周大于结束周'], 401);
        }
       
        
         $sameWeek = Course::where([
            'date' => $course['date'],
            'section' => $course['section'],
            'user_id' => $course['user_id'],
            'semester_id' => $course['semester_id']
            ])->select();
          
          
        if(!empty($sameWeek)){
            foreach ($sameWeek as $courses) {
                    if (($course['end_week'] < $courses['start_week'] || $course['start_week'] > $courses['end_week']) && $courses['name'] === $course['name']) {
                        continue;         
                    }else if($course['id'] === $courses['id']){
                        continue;
                    }else{
                        return json(['error' => '课程日期选择失败'], 401);
                    }
                }
            }
        $Cour = Course::find($course['id']);
        $Cour->name = $course['name'];
        $Cour->date = $course['date'];
        $Cour->start_week = $course['start_week'];
        $Cour->end_week = $course['end_week'];
        $Cour->section = $course['section'];
        $Cour->semester_id = $course['semester_id'];
        $Cour->save();
        return json(['success' => '更新课程成功']);
    }
        
    

    public function myCourses() {
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['data']) ? $parsedData['data'] : [];
        $courses = Course::where([
            'user_id' => $data['user_id'],
            'semester_id' => $data['semester_id']
            ])->select();
            return json($courses);
    }


    public function  searchCourses() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
        $data = isset($parsedData['data']) ? $parsedData['data'] : [];
        $Courses = Course::where([
            'user_id' => $data['id'],
            'semester_id' => $data['semester_id']
            ])
        ->where('name', 'like', '%' . $data['name'] . '%')
        ->select();
        return json($Courses);
    }
}