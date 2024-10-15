import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClazzManageComponent} from "./clazz-manage.component";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";


@NgModule({
  declarations: [
    ClazzManageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class ClazzManageModule { }
