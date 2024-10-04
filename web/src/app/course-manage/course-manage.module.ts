import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { CourseManageComponent } from './course-manage.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import {HttpClientModule} from '@angular/common/http';
const routes: Routes = [
  {
    path: '',
    component: CourseManageComponent
  },
  {
    path: 'add',
    component: AddComponent
  },

];

@NgModule({
  declarations: [CourseManageComponent, AddComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],

})
export class CourseManageModule { }
