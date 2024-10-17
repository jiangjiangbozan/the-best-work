import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../service/shared-data.service';
import { UserService } from 'src/service/user.service';
import { User } from 'src/entity/user';
import * as Notiflix from 'notiflix';
import { ClazzService } from 'src/service/clazz.service';
import { combineLatest } from 'rxjs';  
import { SchoolService } from 'src/service/school.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user_id: number = 0;
  users : User[] = [{
    username: 'root',
    name: 'root',
    clazz_name : '',
    school_name: '',
    status: 1,
    role: 0
  }];
  data = {
    name: '',
    clazz_id: 0,
    role: 4
  };
  clazzAndSchool = [{
    school_name: '',
    id: 0,
    clazz_name: ''
  }];
  schools = [{
    name: ''
  }]

  constructor(
    private sharedDataService: SharedDataService,
    private userService: UserService,
    private clazzService: ClazzService,
    private schoolService: SchoolService
  ) { }

  ngOnInit(): void {
    Notiflix.Loading.standard('数据加载中，请稍候');
    combineLatest([  
      this.sharedDataService.currentId, 
      this.userService.getUsers(),
      this.schoolService.getSchoolNames()
    ]).subscribe(([id, users, schools]) => {  
      this.user_id = id;  
      this.users = users;
      this.schools = schools;
      this.clazzService.getClazzAndSchool(this.user_id)
      .subscribe((ClazzAndSchool) => {
        this.clazzAndSchool = ClazzAndSchool;
        // 所有数据都获取完毕后，关闭弹窗
        Notiflix.Loading.remove();
      },(error) => {
        Notiflix.Loading.remove();
      })
    }); 
  }

  onSubmit() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.userService.searchUsers(this.data)
    .subscribe((users) => {
      this.users = users;
      Notiflix.Loading.remove();
    },(error) => {
      Notiflix.Loading.remove();
    })
  }
}
