import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private idSource = new BehaviorSubject<number>(0);  
  currentId = this.idSource.asObservable();  

  constructor() { }

  setId(user_id : number) {
    this.idSource.next(user_id);  
  }
}
