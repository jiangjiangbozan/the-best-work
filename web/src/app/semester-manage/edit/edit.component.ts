import { Component, OnInit } from '@angular/core';
import * as Notiflix from 'notiflix';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { SemesterService } from 'src/service/semester.service';
import { SharedDataService } from 'src/service/shared-data.service';
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
  
  constructor(
    private semesterService: SemesterService,
    private sharedDataService: SharedDataService,
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
    this.data.end_time = this.formGroup.get('end_time')?.value;
    this.data.start_time = this.formGroup.get('start_time')?.value;
    this.data.semester_name = this.formGroup.get('semester_name')?.value;
    this.data.school_id = this.formGroup.get('school_id')?.value;
    this.semesterService.updateSemster(this.data)
    .subscribe(() => {

    })
  }
}
