<?php  
namespace app\index\controller;  
  
use think\facade\Request;  
use think\facade\Log;  
use think\Controller;

class DingdingController extends ScheduleController
{  
    public function sendMessage() {
        
        $unbusyStudentsOfCurrentWeek= $this->getUnbusyStudentsOfCurrentWeek();
        // 钉钉Webhook URL，请替换为你的实际URL和access_token  
        $webhookUrl = 'https://oapi.dingtalk.com/robot/send?access_token=aabccba70a7ddf6ffda986b9f274f1dd1c48dfd65a0fa3e16cd1eb0bcb064aab';  
        $sections = ['1', '2', '3', '4', '5'];
        $week = ['1', '2', '3', '4', '5', '6', '7'];
        $message = '
          <div>  
            <h1>今日行程表</h1>  
            <table>  
                <tr>  
                    <th>时间</th>  
                    <th>星期一</th>  
                    <th>星期二</th>  
                    <th>星期三</th>  
                    <th>星期四</th>  
                    <th>星期五</th>  
                    <th>星期六</th>  
                    <th>星期日</th>  
                </tr>  
                <!-- Rows will be inserted here by PHP -->  
            </table>  
        </div>  
        ';
        // 这是一个用来存储替换后的行的字符串  

        $rows = '';  

        foreach($sections as $section => $time) {
            $row = '<tr>';  
            $row .= '<td>' . htmlspecialchars($this->changeToTime($time)) . '</td>';
           
            foreach($week as $day => $weekday) {
           
                $row .= '<td>';
                //将对象转化为json字符串
                $jsonString = $unbusyStudentsOfCurrentWeek->getContent();
                //将json字符串转化为数组
                $unbusyStudentsOfCurrentWeekArray = json_decode($jsonString, true);
    
                foreach($unbusyStudentsOfCurrentWeekArray as $sutdentdatas) {
                
                    if($sutdentdatas['time'] === $weekday. '-'. $time) {
                        foreach($sutdentdatas['students'] as $student) {
                
                            $row .= '<p>' .$student. '<P>';
                        }
                    }
                }
                $row .= '</td>';
              
            }
            $row .= '</tr>';  
            $rows .= $row;
        }
        $message = str_replace('<!-- Rows will be inserted here by PHP -->', $rows, $message);
        // 要发送的消息内容，这里可以根据钉钉支持的格式（如Markdown、文本等）进行调整  
        $message = [  
            'msgtype' => 'markdown', // 消息类型，可以是markdown、text等  
            'markdown' => [  
                'title' => '新消息通知',  
                'text' => $message  
            ]  
        ];  
        
        // 将消息转换为JSON格式  
        $jsonMessage = json_encode($message, JSON_UNESCAPED_UNICODE);  
        
        // 初始化cURL会话  
        $ch = curl_init($webhookUrl);  
        
        // 设置cURL选项  
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 将curl_exec()获取的信息以文件流的形式返回，而不是直接输出。  
        curl_setopt($ch, CURLOPT_POST, true); // 发送一个POST请求  
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonMessage); // POST请求的数据  
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']); // 设置HTTP头信息  
        
        // 执行cURL会话并获取响应  
        $response = curl_exec($ch);  
        
        // 检查是否有cURL错误  
        if(curl_errno($ch)){  
            echo 'cURL Error: ' . curl_error($ch);  
        } else {  
            // 解析并输出响应  
            $responseArray = json_decode($response, true);  
            if (isset($responseArray['errcode']) && $responseArray['errcode'] != 0) {  
                echo 'Error: ' . $responseArray['errmsg'];  
            } else {  
                echo 'Success: Message sent to DingTalk.';  
            }  
        }  
        
        // 关闭cURL会话  
        curl_close($ch);  
    }

    public function changeToTime($section) {
         // 使用 switch 语句来判断星期几  然后转化为当前星期的星期一
         switch ((int)$section) {   
            case 1:  
                $time = '8:30 - 10:05';
                break;  
            case 2:  
                $time = '10:25 - 12:00';
                break;  
            case 3:  
                  $time = '14:00 - 15:35';  
                break;  
            case 4:  
                  $time = '15:55 - 17:30';  
                break;  
            case 5:  
                  $time = '18:40 - 21:00';  
                break;  
            default:  
               $time = '';
                break;  
        }  
        return $time;
    }
}