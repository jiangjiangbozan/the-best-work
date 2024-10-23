import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SchoolService} from "../../../service/school.service";

interface School {
  id: number;
  name: string;
}
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  schools: School[] = [];
  selectedSchoolId: string = '';
  clazzName: string = '';

  constructor(
    private schoolService: SchoolService, private dialogRef: MatDialogRef<AddComponent>, @Inject(MAT_DIALOG_DATA) public data: any // 接收数据
  ) { }

  ngOnInit(): void {
    this.schoolService.getSchool().subscribe((data: School[]) => {
      this.schools = data;
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.selectedSchoolId) {
      alert('请选择学校！');
      return;
    }
    if (!this.clazzName) {
      alert('请输入班级名称！');
      return;
    }
    this.dialogRef.close({
      schoolId: this.selectedSchoolId,
      name: this.clazzName
    });
  }
}
