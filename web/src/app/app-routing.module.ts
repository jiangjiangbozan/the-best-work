import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from "./personal-center/personal-center.component";
import {CourseManageComponent} from "./course-manage/course-manage.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  {
    path: 'course_manage',
    component: CourseManageComponent
  },
  {
    path: 'index/profile',component: PersonalCenterComponent
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
