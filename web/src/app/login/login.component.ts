import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../service/user.service';
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

  formGroup!: FormGroup;

  constructor(private userService: UserService) {}

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
    if (this.formGroup.invalid) {
      // 如果表单无效，显示错误信息
      Notiflix.Notify.failure('请填写所有必填字段');
      return;
    }

    const username = this.formGroup.get('username')?.value;
    const password = this.formGroup.get('password')?.value;

    Notiflix.Loading.standard('登录中，请稍候...');

    this.userService.login(username, password).subscribe(
      (user) => {
        this.user = user;
        this.beLogin.emit(this.user);
        Notiflix.Loading.remove();
        Notiflix.Notify.success('登录成功！');
      },
      (error) => {
        Notiflix.Loading.remove();
        // 根据错误类型显示不同的错误信息
        if (error.status === 401) {
          Notiflix.Notify.failure('用户名或密码错误');
        } else {
          Notiflix.Notify.failure('登录失败，请稍后再试');
        }
      }
    );
  }


}
