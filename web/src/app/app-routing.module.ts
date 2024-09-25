import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from "./personal-center/personal-center.component";

const routes: Routes = [{
  path: 'index/profile',component: PersonalCenterComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
