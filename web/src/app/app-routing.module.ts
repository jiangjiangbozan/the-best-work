import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from "./personal-center/personal-center.component";
import {CourseManageComponent} from "./course-manage/course-manage.component";
import {AppComponent} from "./app.component";
import {ClazzManageComponent} from "./clazz-manage/clazz-manage.component";
import {SchoolManageComponent} from "./school-manage/school-manage.component";
import {SemesterManageComponent} from "./semester-manage/semester-manage.component";

const routes: Routes = [
  {
    path: 'course_manage',
    loadChildren: () => import('./course-manage/course-manage.module').then(m => m.CourseManageModule)
    // component: CourseManageComponent
  },
  {
    path: 'index/profile',component: PersonalCenterComponent
  },
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'timeTable',
    loadChildren: () => import('./time-table/time-table.module').then(m => m.TimeTableModule)

  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'index/clazz_manage', component: ClazzManageComponent
  },
  {
    path: 'index/school_manage', component: SchoolManageComponent
  },
  {
    path: 'semester_manage', 
    loadChildren: () => import('./semester-manage/semester-manage.module').then(m => m.SemesterManageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
