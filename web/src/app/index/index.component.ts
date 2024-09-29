import { Component, OnInit } from '@angular/core';
import { User } from '../../entity/user';
import {UserService} from '../../service/user.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isLogin = false;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.isLogin().subscribe(() => {
      this.isLogin = true;
    })
  }

  onLogin(user: Event): void {
    console.log('user',user);
    this.isLogin = true;
  }

  Logout(): void {
    this.isLogin = false;
  }
}
