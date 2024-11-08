import { Injectable } from '@angular/core';
import { SharedDataService } from '../service/shared-data.service';
import {UserService} from '../service/user.service';
import { SemesterService } from 'src/service/semester.service';
import { ClazzService } from 'src/service/clazz.service';
import { combineLatest , forkJoin, Observable, of} from 'rxjs';
import { SchoolService } from 'src/service/school.service';
import * as Notiflix from 'notiflix';
import { map } from 'rxjs/operators';
import { switchMap ,catchError,finalize} from 'rxjs/operators';  
@Injectable({
  providedIn: 'root'
})
export class InitService {
  user_id = 0;
  constructor(
    private userService: UserService,
    private sharedDataService: SharedDataService,
    private semesterService: SemesterService,
    private clazzService: ClazzService,
    private schoolService: SchoolService,
  ) { }

  loadAllAppData(): Observable<void> {
            
    return this.userService.isLogin().pipe(
      map((id) => {
        this.user_id = id;``
        this.sharedDataService.setId(this.user_id);
        console.log('init' ,this.user_id)   
        Notiflix.Loading.standard('数据加载中，请稍候');
      }),
      switchMap(() => combineLatest([
        this.semesterService.getSemsters(this.user_id),
        this.semesterService.getCurrentSemesterId(this.user_id),
        this.clazzService.getCurrentClazzName(this.user_id),
        this.schoolService.getCurrentSchool(this.user_id).pipe(
          map(schoolData => ({ school_name: schoolData.school_name, id: schoolData.id }))
        ),
        this.userService.getUserRole()
      ])),
      map(([semesters, semester_id, clazz_name, school, role]) => {
        console.log('init' ,this.user_id)
        this.sharedDataService.setSemsters(semesters);
        this.sharedDataService.setCurrentSemsterId(semester_id);
        this.sharedDataService.setClazz(clazz_name);
        this.sharedDataService.setSchool(school.school_name);
        this.sharedDataService.setSchoolId(school.id);
        this.sharedDataService.setRole(role);
      }),
      catchError(error => {
        console.error('Error loading app data:', error);
        Notiflix.Notify.failure('加载数据失败，请稍后再试。');
        return of(undefined); // 或者根据需要返回其他值或抛出错误
      }),
      finalize(() => {
        Notiflix.Loading.remove(); // 关闭加载弹窗
      })
    );
  }
}
