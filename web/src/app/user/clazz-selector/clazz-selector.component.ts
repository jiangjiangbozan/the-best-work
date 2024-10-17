import { Component, OnInit, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators} from '@angular/forms';
import * as Notiflix from 'notiflix';
import { UserService } from 'src/service/user.service';
import { combineLatest } from 'rxjs';  
import { SharedDataService } from 'src/service/shared-data.service';
import { SchoolService } from 'src/service/school.service';
import { ClazzService } from 'src/service/clazz.service';
@Component({
  selector: 'app-clazz-selector',
  templateUrl: './clazz-selector.component.html',
  styleUrls: ['./clazz-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return ClazzSelectorComponent;
      })
    }
  ]
})
export class ClazzSelectorComponent implements OnInit, ControlValueAccessor {


    clazz_id= new FormControl(null, Validators.required);

  data = {
    name: '',
    clazz_id: 0,
    role: 4
  };
  clazzAndSchool = [{
    school_name: '',
    id: 0,
    clazz_name: ''
  }];
  schools = [{
    name: ''
  }]

  constructor(
    private sharedDataService: SharedDataService,
    private schoolService: SchoolService,
    private clazzService: ClazzService
  ) { }

  writeValue(obj: any): void {
    this.clazz_id.setValue(obj);
    console.log('write');
  }
  registerOnChange(fn: (data: number) => void): void {
    this.clazz_id.valueChanges
      .subscribe(clazz_id => fn(clazz_id));
    console.log(this.clazz_id);
  }
  registerOnTouched(fn: any): void {
    console.log('touch');
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('disable');
  }

  ngOnInit(): void {
    Notiflix.Loading.standard('数据加载中，请稍候');
    combineLatest([  
      this.sharedDataService.currentId, 
      this.schoolService.getSchoolNames()
    ]).subscribe(([id, schools]) => {  
      this.schools = schools;
      this.clazzService.getClazzAndSchool()
      .subscribe((ClazzAndSchool) => {
        this.clazzAndSchool = ClazzAndSchool;
        // 所有数据都获取完毕后，关闭弹窗
        Notiflix.Loading.remove();
      },(error) => {
        Notiflix.Loading.remove();
      })
    }); 
  }

}
