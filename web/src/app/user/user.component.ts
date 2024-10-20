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

  pageData ={ 
    size : 5,
    tolalElementsOfData : 0,
    currentPage: 1,
    totalPages:2,
    first:true,
    last: false
  }
 pages : number[] =[];
  user_id: number = 0;
  user_role = 0;
  users : User[] = [{
    id:0,
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
    role: 4,
    currentPage: this.pageData.currentPage,
    size : this.pageData.size,
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
      this.userService.getUsers({
        currentPage: this.pageData.currentPage,
        size: this.pageData.size
      }),
      this.schoolService.getSchoolNames(),
      this.sharedDataService.currentRole,
    ]).subscribe(([id, pageData, schools, role]) => {  
      this.user_id = id;  
      this.users = pageData.users;
      this.definePageData(pageData.tolalElementsOfData);
      this.schools = schools;
      this.clazzService.getClazzAndSchool(this.user_id)
      .subscribe((ClazzAndSchool) => {
        this.clazzAndSchool = ClazzAndSchool;
        // 所有数据都获取完毕后，关闭弹窗
        Notiflix.Loading.remove();
      });
      this.user_role = role;
    },(error) => {
        Notiflix.Loading.remove();
    });

  }

  changeStatus(user_id:number, changeStauts: number) {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.userService.changeStatus(user_id, changeStauts)
    .subscribe(() => {
      Notiflix.Loading.remove();
      this.ngOnInit();
    })
  }
  onSubmit() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.userService.searchUsers(this.data)
    .subscribe((data) => {
      this.users = data.users;
      this.definePageData(data.tolalElementsOfData);
      Notiflix.Loading.remove();
    },(error) => {
      Notiflix.Loading.remove();
    })
  }

  definePageData(tolalElementsOfData: number) {
    let begin = 1;
    this.pageData.tolalElementsOfData = tolalElementsOfData;
    this.pageData.totalPages = Math.ceil(this.pageData.tolalElementsOfData / this.pageData.size);
    for (let i = 1; i <=  this.pageData.totalPages; i++, begin++) {
      this.pages.push(begin);
    }
    if(this.pageData.currentPage === 1){
      this.pageData.first = true;
    }else{
      this.pageData.first = false;
    }
    if(this.pageData.currentPage === this.pageData.totalPages){
      this.pageData.last = true;
    }else{
      this.pageData.last = false;
    }
  }

  loadByPage(currentPage: number) {
    this.userService.getUsers({
      currentPage: this.pageData.currentPage,
      size: this.pageData.size
    }).subscribe((pageData) => {
      this.definePageData(pageData.tolalElementsOfData);
      this.users = pageData.users;
      Notiflix.Loading.remove();
    })
  }

  onDelect(user_id: number) {
    Notiflix.Loading.standard('删除用户数据中，请稍候');
    this.userService.deleteUser(user_id)
    .subscribe(() => {
      this.ngOnInit();  
      Notiflix.Loading.remove();
      Notiflix.Report.success(
        '删除用户成功',
        '"',
        '好的'
      );
    },(error) => {
      Notiflix.Loading.remove();
    })
  }
  onPage(currentPage: number){
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.pageData.currentPage = currentPage;
    this.loadByPage(currentPage);
  }

  frontPage() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.pageData.currentPage = this.pageData.currentPage - 1;
    this.loadByPage(this.pageData.currentPage);
  }

  nextPage() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.pageData.currentPage = this.pageData.currentPage + 1;
    this.loadByPage(this.pageData.currentPage);
  }
}
