import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { AddComponent } from './add.component';
import { DateSeletorComponent } from '../date-seletor/date-seletor.component';
import { EndTimeSeletorComponent } from '../end-time-seletor/end-time-seletor.component';
describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        AddComponent,
        DateSeletorComponent,
        EndTimeSeletorComponent
       ],
      imports:[
        FormControl,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
