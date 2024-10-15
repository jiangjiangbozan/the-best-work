import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from "rxjs/operators";

interface School {
  id: number;
  name: string;
}

interface SchoolsResponse {
  data: School[];
  total: number;
}

// 定义返回的数据结构
interface CheckSchoolResponse {
  exists: boolean;
  error?: string; // 可选的错误信息
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private httpClient: HttpClient) {
  }

  // 获取当前登陆用户班级信息
  getCurrentSchoolName(user_id: number): Observable<string> {
    return this.httpClient.post<string>('api/school/getCurrentSchoolName', {user_id});
  }

  getSchools(page: number = 1, size: number = 10, schoolName: string = ''): Observable<SchoolsResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('school', schoolName);

    // @ts-ignore
    return this.httpClient.get<SchoolsResponse>('api/school/index', {params});
  }

  addSchool(schoolData: { name: string }): Observable<any> {
    return this.httpClient.post('api/school/add', schoolData);
  }

  deleteSchool(schoolId: number): Observable<any> {
    return this.httpClient.delete(`/api/school/delete?id=${schoolId}`);
  }

  // 检查学校名称是否存在的服务方法
  checkSchoolNameExists(name: string): Observable<CheckSchoolResponse> {
    const body = { name: name }; // 发送学校名称作为请求体

    return this.httpClient.post<CheckSchoolResponse>('/api/school/checkNameExists', body)
      .pipe(map(response => response)); // 不需要额外转换
  }
}
