import { Component, OnInit } from '@angular/core';
import { Course } from '../../../entity/course';
import { CourseService } from 'src/service/course.service';
import { SharedDataService } from 'src/service/shared-data.service';
import { Router} from '@angular/router';
import { Confirm } from 'notiflix';
import * as Notiflix from 'notiflix';
import { FormControl, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    date : new FormControl(null, Validators.required),
    name : new FormControl('', Validators.required),
    section : new FormControl(null, Validators.required),
    start_week : new FormControl(null, Validators.required),
    end_week : new FormControl(null, Validators.required),
  });

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
    });
    this.sharedDataService.currentSemesterId.subscribe((semester_id) => {
      this.course.semester_id =semester_id;
    })
  }

  onSubmit() {
    this.course.date = this.formGroup.get('date')?.value;
    this.course.name = this.formGroup.get('name')?.value;
    this.course.section = this.formGroup.get('section')?.value;
    this.course.start_week = this.formGroup.get('start_week')?.value;
    this.course.end_week = this.formGroup.get('end_week')?.value;

    this.courseService.addCourse(this.course)
      .subscribe(() => {
        // 成功添加课程后的操作
        Notiflix.Notify.success('课程添加成功！');
        this.router.navigate(['course_manage']);
      }, (error) => {
        // 添加课程失败后的操作
        Notiflix.Notify.failure('课程添加失败: ' + error.error.error);
      });
  }
}
