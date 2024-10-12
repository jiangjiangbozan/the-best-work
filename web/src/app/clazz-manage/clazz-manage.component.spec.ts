import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClazzManageComponent } from './clazz-manage.component';

describe('ClazzManageComponent', () => {
  let component: ClazzManageComponent;
  let fixture: ComponentFixture<ClazzManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClazzManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClazzManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
