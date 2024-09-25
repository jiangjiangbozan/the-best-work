import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseManageComponent } from './course-manage.component';

fdescribe('CourseManageComponent', () => {
  let component: CourseManageComponent;
  let fixture: ComponentFixture<CourseManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseManageComponent ]
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
