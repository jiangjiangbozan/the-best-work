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
                }else {
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
        $user_id = isset($parsedData['user_id']) ? $parsedData['user_id'] : 0;
        $courses = Course::where('user_id', $user_id)->select();
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
         $newCourse = Course::where('id', $course['id'])->find();
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
                }else {
                    return json(['error' => '课程日期更改失败'], 401);
                }
              }
        }
        $newCourse->save();
        return json(['success' => '更新课程成功']);
    }

    
}