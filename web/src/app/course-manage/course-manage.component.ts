import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/service/course.service';

@Component({
  selector: 'app-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.css']
})
export class CourseManageComponent implements OnInit {

  user_id = 1;
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getCourses(this.user_id)
    .subscribe(data => {
      console.log(data);
    })
  }



}
