import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from "rxjs/operators";

interface Clazz {
  id: number;
  name: string;
}

interface SchoolsResponse {
  data: Clazz[];
  total: number;
}

interface CheckClazzResponse {
  exists: boolean;
  error?: string; // 可选的错误信息
}

@Injectable({
  providedIn: 'root'
})
export class ClazzService {

  constructor(private httpClient: HttpClient) { }

  // 获取当前登陆用户班级信息
  getCurrentClazzName(user_id: number): Observable<string> {
    return this.httpClient.post<string>('api/clazz/getCurrentClazzName', {user_id});
  }

  getClazzAndSchool(user_id?: number): Observable<[]> {
    return this.httpClient.post<[]>('api/clazz/getClazzAndSchool', {user_id});
  }

  addClazz(clazzData: { school_id: number, name: string }): Observable<any> {
    return this.httpClient.post('api/clazz/add', clazzData);
  }

  checkClazzNameExists(name: string): Observable<CheckClazzResponse> {
    const body = { name: name }; // 发送学校名称作为请求体

    return this.httpClient.post<CheckClazzResponse>('/api/clazz/checkNameExists', body)
      .pipe(map(response => response)); // 不需要额外转换
  }

  updateClazz(id: number, clazzData: { name: string, schoolId: number }): Observable<any> {
    return this.httpClient.put(`/api/clazz/update?id=${id}`, clazzData);
  }
}
