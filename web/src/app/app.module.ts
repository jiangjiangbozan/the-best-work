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
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {SchoolManageModule} from "./school-manage/school-manage.module";

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
    RouterModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,
    SchoolManageModule
  ],
  providers: [],
  bootstrap: [IndexComponent]
})
export class AppModule { }
