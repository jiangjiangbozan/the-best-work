import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SchoolService} from "../../../service/school.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as Notiflix from "notiflix";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.data.school.name, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedSchool = this.editForm.value;
      this.schoolService.updateSchool(this.data.school.id, updatedSchool).subscribe(
        () => {
          this.dialogRef.close(updatedSchool); // 关闭对话框并返回新的学校数据
          Notiflix.Notify.success('学校名称更新成功！');
        },
        error => {
          console.error('Error updating school:', error);
          Notiflix.Notify.failure('更新学校名称失败，请重试！');
        }
      );
    }
  }

}
