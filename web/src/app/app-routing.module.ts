import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'course_manage',
    component: CourseManageComponent
  },
  {
    path: '',
    component: AppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }