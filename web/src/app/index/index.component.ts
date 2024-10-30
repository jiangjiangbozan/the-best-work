import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../service/shared-data.service';
import {UserService} from '../../service/user.service';
import { SemesterService } from 'src/service/semester.service';
import { ClazzService } from 'src/service/clazz.service';
import { combineLatest } from 'rxjs';
import { SchoolService } from 'src/service/school.service';
import * as Notiflix from 'notiflix';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isLogin = false;
  user_id = 0;

  constructor(
    private userService: UserService,
    private sharedDataService: SharedDataService,
    private semesterService: SemesterService,
    private clazzService: ClazzService,
    private schoolService: SchoolService,
  ) { }

  ngOnInit(): void {
    this.userService.isLogin().subscribe((data) => {
      Notiflix.Loading.standard('数据加载中，请稍候');
      this.isLogin = true;
      this.user_id = data.id;
      this.sharedDataService.setId(this.user_id);
      combineLatest([
        this.semesterService.getSemsters(this.user_id),
        this.semesterService.getCurrentSemesterId(this.user_id),
        this.clazzService.getCurrentClazzName(this.user_id),
        this.schoolService.getCurrentSchool(this.user_id),
        this.userService.getUserRole(),
      ]).subscribe(([semesters, semester_id, clazz_name, data, role]) => {
        this.sharedDataService.setSemsters(semesters);
        this.sharedDataService.setCurrentSemsterId(semester_id);
        this.sharedDataService.setClazz(clazz_name);
        this.sharedDataService.setSchool(data.school_name);
        this.sharedDataService.setSchoolId(data.id);
        this.sharedDataService.setRole(role);
        Notiflix.Loading.remove();
      });
        // 所有数据都获取完毕后，关闭弹窗
      },(error) => {
        Notiflix.Loading.remove();
      });
  }

  onLogin(): void {
    this.ngOnInit();
    this.isLogin = true;
  }

  Logout(): void {
    window.sessionStorage.clear();
    this.user_id = 0;
    this.isLogin = false;
  }

}
