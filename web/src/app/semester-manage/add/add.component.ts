import { Component, OnInit } from '@angular/core';
import * as Notiflix from 'notiflix';
import { FormControl, FormGroup} from '@angular/forms';
import { SemesterService } from 'src/service/semester.service';
import { SharedDataService } from 'src/service/shared-data.service';
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
    school_id : new FormControl(),
    semester_name : new FormControl(),
    end_time : new FormControl(),
    start_time : new FormControl(),
  });
  
  constructor(
    private semesterService: SemesterService,
    private sharedDataService: SharedDataService,
  ) { }

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
      .subscribe(() => {

      })
  }

}
