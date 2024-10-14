import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { SharedDataService } from '../../service/shared-data.service';
import { Confirm } from 'notiflix';
import { Course } from 'src/entity/course';
@Component({
  selector: 'app-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.css']
})
export class CourseManageComponent implements OnInit {

  user_id = 0;

  courses: Course[] = [{
    id: 0,
    user_id: 0,
    name: '',
    start_week: 1,
    end_week: 1,
    section: 1,
    date: 1,
    semester_id : 3
  }]; 

  course = {
    id: this.user_id,
    name: '' ,
    semester_id: 0
  };

  data = {
    user_id: 0,
    semester_id: 0
  };

  semesters = Array();
  constructor(
    private courseService: CourseService, 
    private sharedDataService:SharedDataService
  ) { 
  }
 
  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((id) => {
      this.user_id = id;
      this.course.id = id;
      this.data.user_id = id;
    });
    this.sharedDataService.currentSemesterId
    .subscribe((semester_id) => {
      this.data.semester_id = semester_id;
      this.course.semester_id = semester_id;
      this.courseService.getCourses(this.data)
      .subscribe(data => {
        this.courses= data;
      })
    });
    this.sharedDataService.currentSemesters
    .subscribe((semesters) => {
      this.semesters = semesters;
    });
  }

  onDelect(id: number) {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.courseService.delectCourse(id)
          .subscribe(() => {
            console.log('删除成功'),
            this.ngOnInit()
          })
      })
  }

  onSubmit() {
   this.courseService.searchCourses(this.course)
   .subscribe((data) => {
    this.courses= data;
   })
  }
}
