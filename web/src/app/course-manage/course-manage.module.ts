import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { CourseManageComponent } from './course-manage.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { EditComponent } from './edit/edit.component';
import { DateSeletorComponent } from './date-seletor/date-seletor.component';
import { EndTimeSeletorComponent } from './end-time-seletor/end-time-seletor.component';
const routes: Routes = [
  {
    path: '',
    component: CourseManageComponent
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
    CourseManageComponent, 
    AddComponent, 
    EditComponent, 
    DateSeletorComponent, EndTimeSeletorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],

})
export class CourseManageModule { }
