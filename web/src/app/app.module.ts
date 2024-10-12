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
import { CourseManageComponent } from './course-manage/course-manage.component';
import {RouterModule} from '@angular/router';
import { UserComponent } from './user/user.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    TemplateUpComponent,
    TemplateDownComponent,
    PersonalCenterComponent
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
