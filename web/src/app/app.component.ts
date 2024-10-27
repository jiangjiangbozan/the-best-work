import {Component, OnInit} from '@angular/core';
import * as Notiflix from "notiflix";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    Notiflix.Notify.success('欢迎您使用课表管理系统！');
  }
}
