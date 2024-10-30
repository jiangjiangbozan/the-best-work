import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ScheduleService } from 'src/service/schedule.service';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  sectionNumber = Array.from({ length: 5 }, (_, i) => i + 1);  
  dateNumber = Array.from({ length: 7 }, (_, i) => i + 1);  
  currentDate = new Date();
  formGroup = new FormGroup({
    date : new FormControl('', Validators.required),
  });
  data = {
    date: '',
  }

  PeopleHaveCourse = [{
    time: '',
    students: []
  }];
  weekDates: string[] = []; 
  constructor(
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    // 调用函数来格式化日期  
    let formattedDate = this.formatDateToYYYYMMDD(this.currentDate);  
    this.formGroup.get('date')?.setValue(formattedDate);
    this.scheduleService.getFirstDayOfCurrentWeek(this.formGroup.get('date')?.value)
    .subscribe((firstDayOfCurrentWeek) => {
      this.caculateWeekDay(firstDayOfCurrentWeek);
      this.scheduleService.getUnbusyStudentsOfCurrentWeek(firstDayOfCurrentWeek)
        .subscribe((data) => {
          this.PeopleHaveCourse = data;
        })
    })
  }

  onSubmit() {
 
    this.scheduleService.getFirstDayOfCurrentWeek(this.formGroup.get('date')?.value)
    .subscribe((firstDayOfCurrentWeek) => {
      this.caculateWeekDay(firstDayOfCurrentWeek);
      this.scheduleService.getUnbusyStudentsOfCurrentWeek(firstDayOfCurrentWeek)
        .subscribe((data) => {
          this.PeopleHaveCourse = data;
        })
    })
  }

  //获取整个星期每天的日期
  caculateWeekDay(firstDayOfCurrentWeek : string) {
    this.weekDates = [];
    //创建一个date对象才能进行操作
    const Monday = new Date(firstDayOfCurrentWeek);
    for(let i=0; i< 7; i++) {
      const date = new Date(Monday);  
      date.setDate(Monday.getDate() + i);  
      // 自定义格式化函数  
      const formattedDate = this.formatDateToYYYYMMDD(date);  
      this.weekDates.push(formattedDate);  
    }
  }

  // 格式化日期的函数  
  formatDateToYYYYMMDD(date: Date): string {  
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const day = String(date.getDate()).padStart(2, '0');  
    const time = date.getTime();
    return `${year}-${month}-${day}`;  
  } 

    // 辅助方法：根据日期返回星期几（中文）  
    getDayOfWeek(day: number): string {  
      const daysOfWeek = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六','星期日'];  
      return daysOfWeek[day];  
    } 
} 
