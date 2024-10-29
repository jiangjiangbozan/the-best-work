import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClazzService} from "../../../service/clazz.service";
import {SchoolService} from "../../../service/school.service";
import * as Notiflix from "notiflix";

interface ClassroomEditData {
  id: number;
  name: string;
  schoolId: number;
}
interface School {
  id: number;
  name: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form!: FormGroup;
  schools: School[] = [];
  selectedSchoolId: number = 0; // 初始化为0
  originalData: ClassroomEditData = {...this.data}; // 使用对象解构来创建副本

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<EditComponent>,
      @Inject(MAT_DIALOG_DATA) private data: ClassroomEditData,
      private clazzService: ClazzService,
      private schoolService: SchoolService
  ) {
    console.log(data,3);
    this.loadSchools(); // 加载学校列表
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.name, [Validators.required]],
      schoolId: [this.selectedSchoolId, [Validators.required]]
    });
    // 设置默认学校ID
    this.form.get('schoolId')?.setValue(this.data.schoolId, { emitEvent: false });
  }

  loadSchools(): void {
    this.schoolService.getSchool().subscribe(
        (schoolsData) => {
          console.log(schoolsData,1);
          this.schools = schoolsData;
          // 初始化下拉列表时选择正确的学校
          this.form.get('schoolId')?.setValue(this.data.schoolId, { emitEvent: false });
        },
        (error) => {
          console.error('无法加载学校列表', error);
        }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const clazzData = {
        name: this.form.get('name')?.value,
        schoolId: this.form.get('schoolId')?.value
      };

      // 将班级ID作为URL参数传递给后端
      Notiflix.Loading.standard('正在更新班级信息...');
      // @ts-ignore
      this.clazzService.updateClazz(this.data.clazz.id, clazzData).subscribe(
          (response) => {
            Notiflix.Loading.remove();
            if (response.status === 'success') {
              Notiflix.Notify.success('班级信息更新成功！');
            } else if (response.status === 'info') {
              Notiflix.Notify.info('班级信息未更改，因为提供的值与现有值相同。');
            } else if (response.status === 'fail') {
              Notiflix.Notify.failure(response.message || '更新班级信息失败，请重试！');
            }
            this.dialogRef.close(true);
          },
          (error) => {
            Notiflix.Loading.remove();
            // 如果后端返回了具体的错误信息，你可以使用 error.error 来获取
            Notiflix.Notify.failure(error.error ? error.error.message : '更新班级信息失败，请重试！');
          }
      );

    }
  }

  close(): void {
    this.dialogRef.close(false);
    this.form.reset(this.originalData); // 重置表单到原始数据状态
    this.dialogRef.close(false);
  }

}
