import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SemesterManageComponent } from './semester-manage.component';
import {RouterModule, Routes} from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { SchoolSelectorComponent } from './school-selector/school-selector.component';

const routes: Routes = [
  {
    path: '',
    component: SemesterManageComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  }
];
@NgModule({
  declarations: [
    SemesterManageComponent, 
    AddComponent, 
    EditComponent,
    SchoolSelectorComponent,
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class SemesterManageModule { }
