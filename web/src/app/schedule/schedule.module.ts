import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule.component';
const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent
  },
];

@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ScheduleModule { }
