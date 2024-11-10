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

class PublicScheduleController extends Controller
{
    private $tokenValidityPeriod = 3600; // 令牌有效期为 1 小时（以秒为单位）

    public function generateToken()
    {
        $bytes = openssl_random_pseudo_bytes(16);
        $token = bin2hex($bytes);
        // 将令牌和生成时间存储在缓存中，以便后续验证
        cache($token, time(), $this->tokenValidityPeriod);
        return $token;
    }

    public function showScheduleWithToken($token)
    {
        if ($this->isTokenValid($token)) {
            // 解析 JSON 数据
            $parsedData = json_decode(Request::instance()->getContent(), true);
            $date = isset($parsedData['date'])? $parsedData['date'] : $this->changeToMonday(time());
            // 将日期转换为时间戳
            $timestamp = strtotime($date);
            $semesters = Semester::all();
            $UnbusyStudentsOfCurrentWeek = array();

            // 先查找今天时间所在的所有学期
            foreach ($semesters as $semester) {
                if ((strtotime($semester['start_time']) <= $timestamp) && (strtotime($semester['end_time']) >= $timestamp)) {
                    $Semester = Semester::with('school')->find($semester['id']);
                    // 找到学校的班级
                    $clazzes = School::get($Semester->school->id)->clazz()->select();

                    // 将该学期的开始时间记录为该星期的星期一的日期字符串
                    $start_time = $this->changeToMonday(strtotime($Semester->start_time));
                    // 计算当前星期和当前学期开始星期的偏移量,查询时应该加一
                    $weekOffset = floor(($timestamp - strtotime($start_time)) / (60 * 60 * 24 * 7));
                    // 循环班级
                    foreach ($clazzes as $clazz) {
                        // 找到班级里全部用户
                        $users = Clazz::get($clazz->id)->user()->select();
                        foreach ($users as $user) {
                            // 用户学期内的课程
                            $courses = Course::where([
                                'semester_id' => $Semester->id,
                                'user_id' => $user['id'],
                            ])->where('start_week', '<=', $weekOffset + 1)
                                ->where('end_week', '>=', $weekOffset + 1)
                                ->select();
                            if (count($courses)!== 0) {
                                foreach ($courses as $course) {
                                    $time = (string)$course['date']. '-'. (string)$course['section'];
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

            // 定义时间数组
            $times = [
                '8:30 - 10:05',
                '10:25 - 12:00',
                '14:00 - 15:35',
                '15:55 - 17:30',
                '18:40 - 21:00'
            ];

            // 定义星期数组
            $weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

            // 初始化一个二维数组，用于存储每个时间段和星期组合的学生列表
            $schedule = array_fill_keys($weekdays, array_fill_keys($times, ''));

            // 填充 $schedule 数组
            foreach ($UnbusyStudentsOfCurrentWeek as$entry) {
                list($weekdayNumber,$section) = explode('-', $entry['time']);
                $weekday =$weekdays[$weekdayNumber - 1]; // 星期数减1以匹配数组索引
                foreach ($entry['students'] as$student) {
                    $schedule[$weekday][$times[$section - 1]] .= $student . '<br>';
                }
            }

            // 生成 HTML 表格
            $tableHtml = '<table border="1">';$tableHtml .= '<tr><th></th>';

            // 生成星期标题行
            foreach ($weekdays as$weekday) {
                $tableHtml .= '<th>' .$weekday . '</th>';
            }
            $tableHtml .= '</tr>';

            // 生成表格主体
            foreach ($times as$index => $time) {
                $tableHtml .= '<tr>';
                $tableHtml .= '<td>' .$time . '</td>';
                foreach ($weekdays as$weekday) {
                    $students = isset($schedule[$weekday][$time]) ? trim($schedule[$weekday][$time], '<br>') : '';
                    $tableHtml .= '<td>' .$students . '</td>';
                }
                $tableHtml .= '</tr>';
            }

            $tableHtml .= '</table>';

            return $tableHtml;
        } else {
            return $this->error('无效的访问令牌');
        }
    }

    private function isTokenValid($token)
    {
        $generatedTime = cache($token);
        if ($generatedTime) {
            $currentTime = time();
            return ($currentTime - $generatedTime) < $this->tokenValidityPeriod;
        }
        return false;
    }

    public function changeToMonday($timestamp)
    {
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
