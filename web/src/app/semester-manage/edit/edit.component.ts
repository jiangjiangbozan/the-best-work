import { Component, OnInit } from '@angular/core';
import * as Notiflix from 'notiflix';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { SemesterService } from 'src/service/semester.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  data = {
    id:0,
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
  showAllSchoolsInEdit = false;

  constructor(
    private semesterService: SemesterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //获取id
    const id = this.activatedRoute.snapshot.params.id;
    this.data.id = id;

    this.semesterService.getSemster(id)
    .subscribe((semester) => {
      this.formGroup.get('school_id')?.setValue(semester.school_id);
      this.formGroup.get('semester_name')?.setValue(semester.name);
      this.formGroup.get('end_time')?.setValue(semester.end_time);
      this.formGroup.get('start_time')?.setValue(semester.start_time);
    })
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.data.end_time = this.formGroup.get('end_time')?.value;
      this.data.start_time = this.formGroup.get('start_time')?.value;
      this.data.semester_name = this.formGroup.get('semester_name')?.value;
      this.data.school_id = this.formGroup.get('school_id')?.value;

      this.semesterService.updateSemster(this.data).subscribe({
        next: () => {
          Notiflix.Notify.success('学期信息更新成功');
          this.router.navigateByUrl('/semester_manage');
        },
        error: (errorResponse) => {
          // 根据后端返回的错误信息显示提示
          let errorMessage = '更新失败，请稍后再试';
          if (errorResponse.error && errorResponse.error.error) {
            errorMessage = errorResponse.error.error;
          }
          Notiflix.Notify.failure(errorMessage);
        }
      });
    } else {
      Notiflix.Notify.failure('表单数据不完整或不正确，请检查后重试');
    }
  }
}
