import { Component, OnInit } from '@angular/core';
import { Course } from '../../../entity/course';
import { CourseService } from 'src/service/course.service';
import { SharedDataService } from 'src/service/shared-data.service';
import { Router} from '@angular/router';
import { Confirm } from 'notiflix';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  course = {
    user_id: 0,
    name: '',
    date: 0,
    start_week: 0,
    end_week:0,
    section: 0,
    semester_id: 0
  } as Course;

  courseName = '';
  constructor(
    private sharedDataService: SharedDataService,
    private courseService: CourseService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((id) => {
      this.course.user_id = id;
    })
  }

  onSubmit(){
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.courseService.addCourse(this.course)
          .subscribe(() => {
            this.router.navigate(['course_manage']);
        });
      })
   
  }
}
