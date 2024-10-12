import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolManageComponent } from './school-manage.component';

describe('SchoolManageComponent', () => {
  let component: SchoolManageComponent;
  let fixture: ComponentFixture<SchoolManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
