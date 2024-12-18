import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
  getCurrentSchool(user_id: number): Observable<any> {
    return this.httpClient.post<any>('api/school/getCurrentSchool', {user_id});
  }

  getSchools(page: number = 1, size: number = 10, schoolName: string = ''): Observable<SchoolsResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    params.set('schoolName', schoolName.toString());

    // @ts-ignore
    return this.httpClient.get<SchoolsResponse>(`api/school/index?${params.toString()}`, {params});
  }

  addSchool(schoolData: { name: string }): Observable<any> {
    return this.httpClient.post('api/school/add', schoolData);
  }

  deleteSchool(schoolId: number): Observable<any> {
    return this.httpClient.delete(`/api/school/delete?id=${schoolId}`);
  }

  checkSchoolNameExists(name: string): Observable<CheckSchoolResponse> {
    const body = { name: name };

    return this.httpClient.post<CheckSchoolResponse>('/api/school/checkNameExists', body)
  }

  updateSchool(schoolId: number, updatedSchool: any): Observable<any> {
    return this.httpClient.put(`/api/school/updateSchool?id=${schoolId}`, updatedSchool);
  }

  getSchoolNames(): Observable<any> {
    return this.httpClient.get<any>('api/school/getSchools');
  }

  getSchool(): Observable<School[]> {
    return this.httpClient.get<School[]>('api/school/getSchools');
  }
}
