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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {SchoolManageModule} from "./school-manage/school-manage.module";
import { SemesterManageModule } from './semester-manage/semester-manage.module';
import {ClazzManageModule} from "./clazz-manage/clazz-manage.module";
import { NoPermissionComponent } from './no-permission/no-permission.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    TemplateUpComponent,
    TemplateDownComponent,
    PersonalCenterComponent,
    NoPermissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    NoopAnimationsModule,
    SchoolManageModule,
    ClazzManageModule,
    SemesterManageModule,
    SchoolManageModule
  ],
  providers: [],
  bootstrap: [IndexComponent]
})
export class AppModule { }
