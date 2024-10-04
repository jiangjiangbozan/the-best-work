import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseManageComponent } from './course-manage.component';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import {RouterTestingModule} from '@angular/router/testing';
fdescribe('CourseManageComponent', () => {
  let component: CourseManageComponent;
  let fixture: ComponentFixture<CourseManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseManageComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
