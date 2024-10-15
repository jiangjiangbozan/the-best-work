import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { SharedDataService } from '../../service/shared-data.service';
import * as Notiflix from 'notiflix';
import { combineLatest } from 'rxjs';  
@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {

  courses = [{
    id: 0,
    name: '',
    section: 1,
    date: 1,
    start_week: 0,
    end_week:0
  }]; 
  weeks = Array();
  semesters = Array();
  data = {
    user_id: 0,
    week : 0,
    semester_id: 1,
  }
  clazz_name = '';
  school_name = '';
  sectionNumber = Array.from({ length: 5 }, (_, i) => i);  
  dateNumber = Array.from({ length: 7 }, (_, i) => i + 1);  

  constructor(
    private courseService: CourseService, 
    private sharedDataService:SharedDataService
  ) { }

  ngOnInit(): void {
    Notiflix.Loading.standard('数据加载中，请稍候');
    combineLatest([  
      this.sharedDataService.currentId,  
      this.sharedDataService.currentSemesters,  
      this.sharedDataService.currentSemesterId,  
      this.sharedDataService.currentClazzName,  
      this.sharedDataService.currentSchoolName  
    ]).subscribe(([id, semesters, semester_id, clazz_name, school_name]) => {  
      this.data.user_id = id;  
      this.semesters = semesters;  
      this.data.semester_id = semester_id;  
      this.clazz_name = clazz_name;  
      this.school_name = school_name;  
      // 所有数据都获取完毕后，关闭弹窗
    }); 
    this.loadByCourses(this.data);
  }

  onSubmit() {
    Notiflix.Loading.dots('数据加载中，请稍候');
    this.loadByCourses(this.data);
  }

  /**
   * 由后台加载预编辑的课程.
   * @param data 课程请求信息.
   */
  loadByCourses(data = {
    user_id: 0,
    week: 0,
    semester_id: 0
  }): void {
    this.courseService.myCourses(data)
    .subscribe((courses) => {
      this.courses = courses;
      Notiflix.Loading.remove();
    })
  }
}
