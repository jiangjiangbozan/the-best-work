import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import {AppComponent} from "./app.component";
import {ClazzManageComponent} from "./clazz-manage/clazz-manage.component";
import {SchoolManageComponent} from "./school-manage/school-manage.component";
import { RoleGuard } from 'src/role.guard';
import { NoPermissionComponent } from './no-permission/no-permission.component';
const routes: Routes = [
  {
    path: 'course_manage',
    loadChildren: () => import('./course-manage/course-manage.module').then(m => m.CourseManageModule)
  },
  {
    path: 'profile',component: PersonalCenterComponent,
  },
  {
    path: 'no-permission',
    component: NoPermissionComponent
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
    path: 'clazz_manage', component: ClazzManageComponent,
    canActivate: [RoleGuard],
    loadChildren: () => import('./clazz-manage/clazz-manage.module').then(m => m.ClazzManageModule)
  },
  {
    path: 'school_manage', component: SchoolManageComponent,
    canActivate: [RoleGuard],
    loadChildren: () => import('./school-manage/school-manage.module').then(m => m.SchoolManageModule)
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
