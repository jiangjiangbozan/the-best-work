import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndTimeSeletorComponent } from './end-time-seletor.component';

describe('EndTimeSeletorComponent', () => {
  let component: EndTimeSeletorComponent;
  let fixture: ComponentFixture<EndTimeSeletorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndTimeSeletorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndTimeSeletorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
