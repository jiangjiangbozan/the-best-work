import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { TemplateUpComponent } from './template-up.component';
import { ReactiveFormsModule } from '@angular/forms'; 

describe('TemplateUpComponent', () => {
  let component: TemplateUpComponent;
  let fixture: ComponentFixture<TemplateUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateUpComponent ],
      imports: [
        HttpClientModule, 
        ReactiveFormsModule
      ]
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
