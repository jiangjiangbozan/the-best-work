import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../service/shared-data.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isLogin = false;
  user_id = 0;

  constructor(private userService: UserService, private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.userService.isLogin().subscribe((data) => {
      this.isLogin = true;
      this.user_id = data.id;
      this.sharedDataService.setId(this.user_id);
    })
  }

  onLogin(user: Event): void {
    console.log('user',user);
    this.isLogin = true;
  }

  Logout(): void {
    this.user_id = 0;
    this.isLogin = false;
  }

}
