import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { TemplateUpComponent } from './template-up/template-up.component';
import { TemplateDownComponent } from './template-down/template-down.component';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import {RouterModule} from '@angular/router';
import { ClazzManageComponent } from './clazz-manage/clazz-manage.component';
import { SchoolManageComponent } from './school-manage/school-manage.component';
import { SemesterManageComponent } from './semester-manage/semester-manage.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    TemplateUpComponent,
    TemplateDownComponent,
    PersonalCenterComponent,
    ClazzManageComponent,
    SchoolManageComponent,
    SemesterManageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [IndexComponent]
})
export class AppModule { }
