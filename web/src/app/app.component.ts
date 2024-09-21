import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = '登陆';
  user = {} as {
    username: string,
    password: string
  };

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
      console.log(user);
    },  (error)=> {
      console.log('失败', error);
    });
  
  }

  getJsonData() {
    this.httpClient.get<any>('/api/index/login').subscribe(data => {
      console.log(data);
    });
  }


}
