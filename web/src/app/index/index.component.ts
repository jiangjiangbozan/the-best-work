import { Component, OnInit } from '@angular/core';
import { User } from '../../entity/user';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isLogin = false;

  constructor() { }

  ngOnInit(): void {
  }

  onLogin(user: Event): void {
    console.log(user);
    this.isLogin = true;
  }

  Logout(): void {
    this.isLogin = false;
  }
}
