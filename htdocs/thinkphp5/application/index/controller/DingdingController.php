<?php  
namespace app\index\controller;  
  
use think\facade\Request;  
use think\facade\Log;  
use think\Controller;

class DingdingController extends ScheduleController
{  
    public function sendMessage() {

        // 生成链接
        $token = (new PublicScheduleController())->generateToken();
        $scheduleLink = "http://47.95.208.109:8111/thinkphp5/public/index/index/dingTalkSchedule?token=" . urlencode($token);
        $message = "### 今日行程表\n点击链接查看具体行程表：[查看行程表]($scheduleLink)\n";

        // 钉钉 Webhook URL，请替换为你的实际 URL 和 access_token
        $webhookUrl = 'https://oapi.dingtalk.com/robot/send?access_token=aabccba70a7ddf6ffda986b9f274f1dd1c48dfd65a0fa3e16cd1eb0bcb064aab';

        $messageData = [
            'msgtype' => 'markdown',
            'markdown' => [
                'title' => '新消息通知',
                'text' => $message
            ]
        ];

        $jsonMessage = json_encode($messageData, JSON_UNESCAPED_UNICODE);

        $ch = curl_init($webhookUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonMessage);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            echo 'cURL Error: '. curl_error($ch);
        } else {
            $responseArray = json_decode($response, true);
            if (isset($responseArray['errcode']) && $responseArray['errcode']!= 0) {
                echo 'Error: '. $responseArray['errmsg'];
            } else {
                echo 'Success: Message sent to DingTalk.';
            }
        }

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