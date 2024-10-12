import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from "./personal-center/personal-center.component";
import {CourseManageComponent} from "./course-manage/course-manage.component";
import {AppComponent} from "./app.component";

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

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
