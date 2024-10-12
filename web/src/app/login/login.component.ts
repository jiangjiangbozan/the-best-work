import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { User } from '../../entity/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = '登录';

  @Output()
  beLogin = new EventEmitter<any>()

  user = {} as User;

  data = {} as {
    username: string,
    password: string
  }

  // @ts-ignore
  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    const username = this.formGroup.get('username')!!.value;
    const password = this.formGroup.get('password')!!.value;
    this.userService.login(username, password).subscribe(user => {

      this.user = user;

      sessionStorage.setItem('user', JSON.stringify(user)); 
      const a = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')!) : null ;
      console.log('a', a);

      this.beLogin.emit(this.user);
    },  (error)=> {

      console.error('错误', error);
    
    });
  }


}
