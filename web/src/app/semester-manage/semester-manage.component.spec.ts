import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SemesterManageComponent } from './semester-manage.component';
import { SchoolSelectorComponent } from './school-selector/school-selector.component';

describe('SemesterManageComponent', () => {
  let component: SemesterManageComponent;
  let fixture: ComponentFixture<SemesterManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        SemesterManageComponent,
        SchoolSelectorComponent
      ],
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
