import { Component, OnInit } from '@angular/core';
import * as Notiflix from 'notiflix';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { SemesterService } from 'src/service/semester.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  data = {
    end_time: '',
    start_time: '',
    school_id: 0,
    semester_name: '',
  };
  formGroup = new FormGroup({
    school_id : new FormControl(null, Validators.required),
    semester_name : new FormControl('', Validators.required),
    end_time : new FormControl('', Validators.required),
    start_time : new FormControl('', Validators.required),
  });
  showAllSchoolsInAdd = false;

  constructor(
    private semesterService: SemesterService, private router: Router,) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.data = {
      end_time :  this.formGroup.get('end_time')?.value,
      start_time: this.formGroup.get('start_time')?.value,
      semester_name: this.formGroup.get('semester_name')?.value,
      school_id : this.formGroup.get('school_id')?.value
    }
    this.semesterService.addSemster(this.data)
      .subscribe({
        next: () => {
          Notiflix.Notify.success('学期添加成功！');
          // 跳转到学期管理页面
          this.router.navigateByUrl('/semester_manage');
        },
        error: (errorResponse) => {
          // 假设后端返回的是 JSON 格式的错误信息
          const errorData = errorResponse.error;
          if (errorData && errorData.error) {
            Notiflix.Notify.failure(errorData.error);
          } else {
            // 如果没有具体的错误信息，显示一个通用的错误消息
            Notiflix.Notify.failure('学期添加失败，请稍后再试。');
          }
        }
      });
  }
}
