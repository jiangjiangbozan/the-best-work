import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  sectionNumber = Array.from({ length: 5 }, (_, i) => i);  
  dateNumber = Array.from({ length: 7 }, (_, i) => i + 1);  
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {

  }
} 
