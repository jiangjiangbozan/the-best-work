import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { SharedDataService } from '../../service/shared-data.service';
import { Course } from '../../entity/course';

@Component({
  selector: 'app-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.css']
})
export class CourseManageComponent implements OnInit {

  user_id = 0;

  courses = [{
    name: '',
    start_week: 1,
    end_week: 1,
    section: 1,
    date: 1
  }]; 

  course = {
  name: '' 
  } as Course;

  constructor(private courseService: CourseService, private sharedDataService:SharedDataService) { 
  }
 
  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((id) => {
      this.user_id = id;
    })
    this.courseService.getCourses(this.user_id)
    .subscribe(data => {
      this.courses= data;
    })
  }
}
