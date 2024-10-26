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
    Notiflix.Loading.standard('用户数据加载中，请稍候');
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
    Notiflix.Loading.standard('正在更改用户状态，请稍候...');
    this.userService.changeStatus(user_id, changeStauts)
      .subscribe(
        () => {
          Notiflix.Loading.remove();
          Notiflix.Report.success(
            '用户状态更改成功',
            '用户的状态已成功更改。',
            '好的'
          );
          this.ngOnInit();
        },
        (error) => {
          Notiflix.Loading.remove();
          Notiflix.Report.failure(
            '用户状态更改失败',
            '无法更改用户的状态。',
            '重试'
          );
        }
      );
  }
  onSubmit() {
    Notiflix.Loading.standard('正在搜索用户，请稍候...');
    this.userService.searchUsers(this.data)
      .subscribe(
        (data) => {
          console.log(data);
          this.users = data.users;
          this.definePageData(data.tolalElementsOfData); // 注意属性名可能已更改，见下文
          Notiflix.Loading.remove();
          Notiflix.Report.info(
            '搜索完成',
            '已找到相关用户。',
            '关闭'
          );
        },
        (error) => {
          Notiflix.Loading.remove();
          Notiflix.Report.failure(
            '搜索失败',
            '无法搜索用户。',
            '重试'
          );
        }
      );
  }

  resetPassword(userId: number) {
    Notiflix.Confirm.show(
      '确认操作',
      '您确定要重置此用户的密码为123吗？',
      '确定',
      '取消',
      () => {
        Notiflix.Loading.standard('正在重置密码，请稍候...');
        this.userService.resetPassword(userId)
          .subscribe(
            () => {
              Notiflix.Loading.remove();
              Notiflix.Report.success(
                '密码重置成功',
                '用户密码已重置为123。',
                '好的'
              );
            },
            (error) => {
              Notiflix.Loading.remove();
              Notiflix.Report.failure(
                '密码重置失败',
                '无法重置用户密码。',
                '重试'
              );
            }
          );
      }
    );
  }

  definePageData(tolalElementsOfData: number) {
    let begin = 1;
    this.pageData.tolalElementsOfData = tolalElementsOfData;
    console.log(this.pageData.tolalElementsOfData);
    this.pageData.totalPages = Math.ceil(this.pageData.tolalElementsOfData / this.pageData.size);
    console.log(this.pageData.totalPages);
    this.pages = [];
    for (let i = 1; i <=  this.pageData.totalPages; i++, begin++) {
      this.pages.push(begin);
    }
    this.pageData.first = this.pageData.currentPage === 1;
    this.pageData.last = this.pageData.currentPage === this.pageData.totalPages;
  }

  loadByPage(currentPage: number) {
    this.userService.getUsers({
      currentPage: currentPage,
      size: this.pageData.size
    }).subscribe(
      (pageData) => {
        this.definePageData(pageData.tolalElementsOfData); // 确保属性名正确
        this.users = pageData.users;
        Notiflix.Loading.remove();
        Notiflix.Report.success(
          '页面加载完成',
          '您已成功导航到新页面。',
          '关闭'
        );
      },
      (error) => {
        Notiflix.Loading.remove();
        Notiflix.Report.failure(
          '页面加载失败',
          '无法加载页面。',
          '重试'
        );
      }
    );
  }

  onDelect(user_id: number) {
    Notiflix.Confirm.show(
      '确认删除',
      '您确定要删除此用户吗？',
      '删除',
      '取消',
      () => {
        // 用户点击了“删除”，执行删除操作
        Notiflix.Loading.standard('正在删除用户，请稍候...');
        this.userService.deleteUser(user_id)
          .subscribe(
            () => {
              this.ngOnInit();
              Notiflix.Loading.remove();
              Notiflix.Report.success(
                '用户删除成功',
                '用户已从系统中删除。',
                '好的'
              );
            },
            (error) => {
              Notiflix.Loading.remove();
              Notiflix.Report.failure(
                '用户删除失败',
                '无法删除用户。',
                '重试'
              );
            }
          );
      },
      () => {
        // 用户点击了“取消”，不执行任何操作
        // 可以在这里添加一些逻辑，比如关闭模态框等
      }
    );
  }
  onPage(currentPage: number) {
    Notiflix.Loading.standard('正在加载页面，请稍候...');
    this.pageData.currentPage = currentPage;
    this.loadByPage(currentPage);
  }

  frontPage() {
    Notiflix.Loading.standard('正在加载前一页，请稍候...');
    this.pageData.currentPage = this.pageData.currentPage - 1;
    this.loadByPage(this.pageData.currentPage);
  }

  nextPage() {
    Notiflix.Loading.standard('正在加载下一页，请稍候...');
    this.pageData.currentPage = this.pageData.currentPage + 1;
    this.loadByPage(this.pageData.currentPage);
  }

}
