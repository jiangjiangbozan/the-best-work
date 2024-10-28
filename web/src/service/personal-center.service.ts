import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PersonalCenterService {

  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<any> {
    return this.httpClient.get('/api/personalCenter/getUserInfo');
  }

  changePassword(userId: number, formData: any): Observable<any> {
    return this.httpClient.post(`/api/personalCenter/changePassword?id=${userId}`, formData)
  }
}
