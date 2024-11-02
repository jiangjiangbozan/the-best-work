import { Component, OnInit, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators} from '@angular/forms';
import { SemesterService } from 'src/service/semester.service';
import { SharedDataService } from 'src/service/shared-data.service';
@Component({
  selector: 'app-date-seletor',
  templateUrl: './date-seletor.component.html',
  styleUrls: ['./date-seletor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return DateSeletorComponent;
      })
    }
  ]
})
export class DateSeletorComponent implements OnInit, ControlValueAccessor {

  totalWeeks : number[] = [];
  semester_id = 0;
  start_week = new FormControl(null, Validators.required);
 
  constructor(
    private semesterService: SemesterService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {
    this.sharedDataService.currentSemesterId.subscribe((semester_id) => {
      this.semester_id = semester_id;
      console.log(this.semester_id);
      this.semesterService.getCurrentSemesterTotalWeek(this.semester_id).subscribe((totalweek) => {
        for (let i = 1; i <=  totalweek; i++) {
          this.totalWeeks.push(i);
        }
      })
    })
  
  }
  writeValue(obj: any): void {
    this.start_week.setValue(obj);
    console.log('write');
  }
  registerOnChange(fn: (data: number) => void): void {
    this.start_week.valueChanges
      .subscribe(start_week =>  {
        fn(start_week);
      });
  }
  registerOnTouched(fn: any): void {
    console.log('touch');
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('disable');
  }
}
