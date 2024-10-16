import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../entity/user';
import * as Notiflix from 'notiflix';
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
              private httpClient: HttpClient
            ) {}

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
    Notiflix.Loading.standard('登录中，请稍候');
    this.userService.login(username, password).subscribe(user => {
      this.user = user;
      this.beLogin.emit(this.user);
      Notiflix.Loading.remove()
    },(error) => {
      Notiflix.Loading.remove();
    });
  }


}
