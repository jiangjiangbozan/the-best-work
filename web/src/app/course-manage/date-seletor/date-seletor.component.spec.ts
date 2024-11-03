import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSeletorComponent } from './date-seletor.component';

describe('DateSeletorComponent', () => {
  let component: DateSeletorComponent;
  let fixture: ComponentFixture<DateSeletorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateSeletorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSeletorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
