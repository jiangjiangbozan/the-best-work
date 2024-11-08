import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../service/user.service';
import { SharedDataService } from 'src/service/shared-data.service';
import { User } from '../../entity/user';
import * as Notiflix from 'notiflix';
import { Router } from '@angular/router';
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

  token = '';

  formGroup!: FormGroup;

  constructor(
    private userService: UserService,
    private shareDataService: SharedDataService,
    private router: Router
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
    if (this.formGroup.invalid) {
      // 如果表单无效，显示错误信息
      Notiflix.Notify.failure('请填写所有必填字段');
      return;
    }

    const username = this.formGroup.get('username')?.value;
    const password = this.formGroup.get('password')?.value;

    Notiflix.Loading.standard('登录中，请稍候...');

    this.userService.login(username, password).subscribe(
      (data) => {
        //由于index组件无法在获取所有数据再渲染界面，只能在login获取
        this.shareDataService.setRole(data.role);
        this.shareDataService.setId(data.user_id);
        this.beLogin.emit();
        //退出登录后不经过路由守卫，只能在登录时判断url
        if(data.role === 0 && (this.router.url === '/user' || this.router.url === '/clazz_manage' || this.router.url === '/school_manage' ||this.router.url === '/semester_manage')) {
          this.router.navigate(['no-permission']);
        }
        this.token = data.token;
        window.sessionStorage.setItem('x-auth-token', data.token);
        localStorage.setItem('hasLoggedIn', 'true');
        Notiflix.Loading.remove();
        Notiflix.Notify.success('登录成功！');
      },
      (error) => {
        Notiflix.Loading.remove();
          Notiflix.Notify.failure(error.error.error);
      }
    );
  }
}
