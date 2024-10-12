import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { SharedDataService } from '../../service/shared-data.service';
import { Course } from '../../entity/course';
import { Confirm } from 'notiflix';
@Component({
  selector: 'app-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.css']
})
export class CourseManageComponent implements OnInit {

  user_id = 0;

  courses = [{
    id: 0,
    user_id: 0,
    name: '',
    start_week: 1,
    end_week: 1,
    section: 1,
    date: 1,
    semester_id : 1
  }]; 

  course = {
    id: this.user_id,
    name: '' 
  };

  constructor(
    private courseService: CourseService, 
    private sharedDataService:SharedDataService
  ) { 
  }
 
  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((id) => {
      this.user_id = id;
      this.course.id = id;
    });
    
    this.courseService.getCourses(this.user_id)
    .subscribe(data => {
      this.courses= data;
    })
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
