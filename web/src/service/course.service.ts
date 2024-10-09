import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Course } from 'src/entity/course';
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClient: HttpClient) { }

  getCourses(user_id: number): Observable<any> {
    return this.httpClient.post<any>('/api/course/getCourses', {user_id})
  }

  addCourse(course: Course): Observable<any> {
    return this.httpClient.post<any>('/api/course/addCourse', {course})
  }

  updateCourse(course: Course): Observable<any> {
    return this.httpClient.post<any>('/api/course/updateCourse', {course})
  }

  getCourse(id: number): Observable<any> {
    return this.httpClient.post<any>('/api/course/getCourse', {id})
  }

  delectCourse(id: number): Observable<any> {
    return this.httpClient.post<any>('/api/course/delectCourse', {id})
  }

  searchCourses(data = {} as {
    id: number,
    name : string
  }): Observable<any> {
    return this.httpClient.post<any>('/api/course/searchCourses', {data})
  }
}
