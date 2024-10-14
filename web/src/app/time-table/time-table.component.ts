import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { SharedDataService } from '../../service/shared-data.service';
import { Course } from '../../entity/course';
import { Confirm } from 'notiflix';

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
    this.sharedDataService.currentId
    .subscribe((id) => {
      this.data.user_id = id;
    });
    this.sharedDataService.currentSemesters
    .subscribe((semesters) => {
      this.semesters = semesters;
    });
    this.sharedDataService.currentSemesterId
    .subscribe((semester_id) => {
      this.data.semester_id = semester_id;
      this.loadByCourses(this.data);
    });
    this.sharedDataService.currentClazzName
    .subscribe((clazz_name) => {
      this.clazz_name = clazz_name;
    });
    this.sharedDataService.currentSchoolName
    .subscribe((school_name) => {
      this.school_name = school_name;
    })
   
  }

  onSubmit() {
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
    })
  }
}
