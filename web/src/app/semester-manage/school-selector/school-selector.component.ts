import {Component, OnInit, forwardRef, Input} from '@angular/core';
import { SchoolService } from 'src/service/school.service';
import { combineLatest } from 'rxjs';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

interface schools {
  id: number;
  name: string;
}
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

  schools!: schools[];
  school_id = new FormControl('', { updateOn: 'change' });
  @Input() showAllOption = true;

  constructor(private schoolService: SchoolService) { 
  }

  writeValue(obj: any): void {
    this.school_id.setValue(obj);
  }

  registerOnChange(fn: (data: number) => void): void {
    this.school_id.valueChanges
      .subscribe(school_id => fn(school_id));
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnInit(): void {
    combineLatest([
      this.schoolService.getSchoolNames(),
    ]).subscribe(([schools]) => {
      this.schools =schools;
    })
  }
}
