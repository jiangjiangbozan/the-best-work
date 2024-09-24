import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDownComponent } from './template-down.component';

describe('TemplateDownComponent', () => {
  let component: TemplateDownComponent;
  let fixture: ComponentFixture<TemplateDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
