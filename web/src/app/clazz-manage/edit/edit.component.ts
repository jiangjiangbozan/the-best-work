import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClazzService} from "../../../service/clazz.service";
import * as Notiflix from "notiflix";
import {SchoolService} from "../../../service/school.service";

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
  schools: School[] = []; // 这里应该是一个数组，但初始时它是空的
  selectedSchoolId: number = this.data.schoolId; // 存储当前选中的学校ID

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ClassroomEditData,
    private clazzService: ClazzService,
    private schoolService: SchoolService // 注入SchoolService来获取学校列表
  ) {
    console.log(data);
    this.loadSchools(); // 调用方法来加载所有学校
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.name, [Validators.required]],
      schoolId: [this.selectedSchoolId, [Validators.required]] // 使用selectedSchoolId来初始化
    });

    // 监听schoolId的变化，以便更新selectedSchoolId
    this.form.get('schoolId')?.valueChanges.subscribe(value => {
      this.selectedSchoolId = value;
    });
  }

  loadSchools(): void {
    this.schoolService.getSchool().subscribe(
      (schoolsData) => {
        console.log(schoolsData);
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
      const clazzData = this.data;
      console.log(this.data, clazzData);
      clazzData.id = this.data.id;
      console.log(clazzData);
      // 调用服务来更新班级信息
      Notiflix.Loading.standard('正在更新班级信息...');
      this.clazzService.updateClazz(clazzData).subscribe(
        (response) => {
          Notiflix.Loading.remove();
          Notiflix.Notify.success('班级信息更新成功！');
          this.dialogRef.close(true);
        },
        (error) => {
          Notiflix.Loading.remove();
          Notiflix.Notify.failure('更新班级信息失败，请重试！');
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
