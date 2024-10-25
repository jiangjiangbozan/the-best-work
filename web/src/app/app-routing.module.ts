import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from "./personal-center/personal-center.component";
import {CourseManageComponent} from "./course-manage/course-manage.component";
import {AppComponent} from "./app.component";
import {ClazzManageComponent} from "./clazz-manage/clazz-manage.component";
import {SchoolManageComponent} from "./school-manage/school-manage.component";
import {SemesterManageComponent} from "./semester-manage/semester-manage.component";
import { RoleGuard } from 'src/role.guard';

const routes: Routes = [
  {
    path: 'course_manage',
    canActivate: [RoleGuard],
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
    canActivate: [RoleGuard],
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'index/clazz_manage', component: ClazzManageComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'index/school_manage', component: SchoolManageComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'semester_manage', 
    canActivate: [RoleGuard],
    loadChildren: () => import('./semester-manage/semester-manage.module').then(m => m.SemesterManageModule)
  },
  {
    path: 'schedule', 
    loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
