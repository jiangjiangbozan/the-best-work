import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../service/shared-data.service';
import { UserService } from 'src/service/user.service';
import { User } from 'src/entity/user';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users : User[] = [{
    username: 'root',
    name: 'root',
    clazz_name : '',
    school_name: '',
    status: 1,
    role: 2
  }]
  constructor(
    private shareDataService: SharedDataService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe((users) => {
     this.users = users;
    })
  }

}
