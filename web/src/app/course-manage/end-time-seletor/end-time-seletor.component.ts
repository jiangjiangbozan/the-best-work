import { Component, OnInit, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators} from '@angular/forms';
import { SemesterService } from 'src/service/semester.service';
import { SharedDataService } from 'src/service/shared-data.service';
@Component({
  selector: 'app-end-time-seletor',
  templateUrl: './end-time-seletor.component.html',
  styleUrls: ['./end-time-seletor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return EndTimeSeletorComponent;
      })
    }
  ]
})
export class EndTimeSeletorComponent implements OnInit {
  end_week = new FormControl(null, Validators.required);
  totalWeeks : number[] = [];
  semester_id = 0;

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
    this.end_week.setValue(obj);
    console.log('write');
  }
  registerOnChange(fn: (data: number) => void): void {
    this.end_week.valueChanges
    .subscribe(end_week => {
      fn(end_week);
      console.log(end_week);
    });    
  }
  registerOnTouched(fn: any): void {
    console.log('touch');
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('disable');
  }
}
