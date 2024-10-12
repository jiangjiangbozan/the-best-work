import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../service/shared-data.service';
import {UserService} from '../../service/user.service';
import { SemesterService } from 'src/service/semester.service';
import { ClazzService } from 'src/service/clazz.service';
import { SchoolService } from 'src/service/school.service';
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
      this.isLogin = true;
      this.user_id = data.id;
      this.sharedDataService.setId(this.user_id);
      this.semesterService.getSemsters(this.user_id)
      .subscribe((semesters) => {
        this.sharedDataService.setSemsters(semesters);
      });
      this.semesterService.getCurrentSemesterId(this.user_id)
      .subscribe((semester_id) => {
        this.sharedDataService.setCurrentSemsterId(semester_id);
      });
      this.clazzService.getCurrentClazzName(this.user_id)
      .subscribe((clazz_name) => {
        this.sharedDataService.setClazz(clazz_name);
        console.log(clazz_name);
      });
      this.schoolService.getCurrentSchoolName(this.user_id)
      .subscribe((school_name) => {
        this.sharedDataService.setSchool(school_name);
      })
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
