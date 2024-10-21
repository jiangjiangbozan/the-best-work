import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SchoolService} from "../../../service/school.service";

interface School {
  id: number;
  name: string;
}

interface SchoolsResponse {
  data: School[];
  total: number;
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
  dataLoaded = false;

  constructor(
    private schoolService: SchoolService, private dialogRef: MatDialogRef<AddComponent>, @Inject(MAT_DIALOG_DATA) public data: any // 接收数据
  ) { }

  ngOnInit(): void {
    this.schoolService.getSchool().subscribe(
      (response: SchoolsResponse) => {
        console.log(response);
        this.schools = response.data; // Default to empty array if undefined
        console.log(this.schools);
      },
      (error) => {
        console.error('Error fetching schools:', error);
        this.schools = []; // Ensure schools is an empty array on error
      }
    );
  }

  onCancelClick(): void {
    this.dialogRef.close({ schoolId: this.selectedSchoolId, name: this.clazzName });
  }

  onSubmit(): void {
    if (!this.selectedSchoolId) {
      // 显示错误提示
      alert('请选择学校！');
      return;
    }
    this.dialogRef.close({
      schoolId: this.selectedSchoolId,
      name: this.clazzName
    });
  }
}
