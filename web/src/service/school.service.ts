import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private httpClient: HttpClient) { }

   // 获取当前登陆用户班级信息
   getCurrentSchoolName(user_id: number): Observable<string> {
    return this.httpClient.post<string>('api/school/getCurrentSchoolName', {user_id});
  }
  getSchools(): Observable<any[]> {
    return this.httpClient.get<any[]>('api/school/getSchools');
  }

}
