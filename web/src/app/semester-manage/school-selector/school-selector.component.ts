import { Component, OnInit, forwardRef} from '@angular/core';
import { SchoolService } from 'src/service/school.service';
import { combineLatest } from 'rxjs';  
import * as Notiflix from 'notiflix';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-school-selector',
  templateUrl: './school-selector.component.html',
  styleUrls: ['./school-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return SchoolSelectorComponent;
      })
    }
  ]
})
export class SchoolSelectorComponent implements OnInit, ControlValueAccessor {

  schools = [{
    name:'',
    id: 0
  }];
  school_id = new FormControl();

  constructor(
    private schoolService: SchoolService
  ) { }

  writeValue(obj: any): void {
    this.school_id.setValue(obj);
    console.log('write');
  }
  registerOnChange(fn: (data: number) => void): void {
    this.school_id.valueChanges
      .subscribe(school_id => fn(school_id));
    console.log(this.school_id);
  }
  registerOnTouched(fn: any): void {
    console.log('touch');
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('disable');
  }
  ngOnInit(): void {
    combineLatest([
      this.schoolService.getSchoolNames(),
    ]).subscribe(([schools]) => {
      this.schools =schools;
    })
  }
}
