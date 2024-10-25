import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { AddSchoolPopupComponent } from './add-school-popup/add-school-popup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SchoolManageComponent} from "./school-manage.component";
import {RouterModule} from "@angular/router";
import { PaginationComponent } from './pagination/pagination.component';



@NgModule({
  declarations: [
    EditComponent,
    DeleteComponent,
    AddSchoolPopupComponent,
    SchoolManageComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [PaginationComponent]
})
export class SchoolManageModule { }
