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
    name: '高数',
    start_week: 1,
    end_week: 1,
    section: 1,
    date: 1
  }]; 
  constructor(private courseService: CourseService, private sharedDataService:SharedDataService) { 
  }
 
  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((id) => {
      this.user_id = id;
    })

    console.log('user', this.user_id);
    
    this.courseService.getCourses(this.user_id)
    .subscribe(data => {
      this.courses= data;
      console.log(this.courses);
    })
  }
}
