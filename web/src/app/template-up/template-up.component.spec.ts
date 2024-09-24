import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateUpComponent } from './template-up.component';

describe('TemplateUpComponent', () => {
  let component: TemplateUpComponent;
  let fixture: ComponentFixture<TemplateUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
