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
    // 检查本地存储中是否有登录过的标志
    if (!localStorage.getItem('hasLoggedIn')) {
      Notiflix.Notify.success('欢迎您使用课表管理系统！');
      // 设置标志，避免下次再显示
      localStorage.setItem('hasLoggedIn', 'true');
    }
  }
}
