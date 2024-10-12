import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private semestersSource = new BehaviorSubject<Array<any>>([]);  
  private semesterIdSource = new BehaviorSubject<number>(0);  
  private idSource = new BehaviorSubject<number>(0); 
  private clazzNameSource = new BehaviorSubject<string>(''); 
  private schoolNameSource = new BehaviorSubject<string>(''); 
  currentId = this.idSource.asObservable();  
  currentSemesters= this.semestersSource.asObservable(); 
  currentSemesterId = this.semesterIdSource.asObservable();
  currentClazzName = this.clazzNameSource.asObservable();
  currentSchoolName = this.schoolNameSource.asObservable();
  constructor() { }

  //设置当前登陆用户的id 
  setId(user_id : number) {
    this.idSource.next(user_id);  
  }

  // 设置当前用户所拥有的全部学期
  setSemsters(semesters: Array<any>) {
    this.semestersSource.next(semesters);
  }

  //设置当前学期id 
  setCurrentSemsterId(semester_id: number) {
    this.semesterIdSource.next(semester_id);
  }

  //设置当前用户班级
  setClazz(clazz_name: string) {
    this.clazzNameSource.next(clazz_name);
  }

    //设置当前用户班级
    setSchool(school_name: string) {
      this.schoolNameSource.next(school_name);
    }
}
