import { Component, OnInit } from '@angular/core';
import { Course } from '../../../entity/course';
import { CourseService } from 'src/service/course.service';
import { SharedDataService } from 'src/service/shared-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Confirm} from 'notiflix';
import * as Notiflix from 'notiflix';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  course = {
    id:0,
    user_id: 0,
    name: '',
    date: 0,
    start_week: 0,
    end_week:0,
    section: 0,
    semester_id: 0
  } as Course;

  constructor(
    private sharedDataService: SharedDataService,
    private courseService: CourseService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((id) => {
      this.course.user_id = id;
    });
    //获取id
    const id = this.activatedRoute.snapshot.params.id;
    this.courseService.getCourse(id)
    .subscribe(((course) => {
      this.course = course;
    }))
  }

  onSubmit() {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.courseService.updateCourse(this.course)
          .subscribe(() => {
            console.log('更新成功');
            this.router.navigate(['course_manage']);
          },(error) => {
            console.log(error.error.error);
            Notiflix.Report.failure(
              '更新用户失败',
              error.error.error,
              '好的'
            );
          });
      })
  }

}
