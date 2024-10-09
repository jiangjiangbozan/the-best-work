import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTableComponent } from './time-table.component';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: TimeTableComponent
  }
];

@NgModule({
  declarations: [TimeTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TimeTableModule { }
