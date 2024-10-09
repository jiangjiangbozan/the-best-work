import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'course_manage',
    loadChildren: () => import('./course-manage/course-manage.module').then(m => m.CourseManageModule)
    // component: CourseManageComponent
  },
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'timeTable',
    loadChildren: () => import('./time-table/time-table.module').then(m => m.TimeTableModule)

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
