import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClazzManageComponent} from "./clazz-manage.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import { AddComponent } from './add/add.component';
import {MatOptionModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    ClazzManageComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class ClazzManageModule { }
