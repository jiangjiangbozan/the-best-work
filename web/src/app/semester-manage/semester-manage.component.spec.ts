import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterManageComponent } from './semester-manage.component';

describe('SemesterManageComponent', () => {
  let component: SemesterManageComponent;
  let fixture: ComponentFixture<SemesterManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemesterManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
