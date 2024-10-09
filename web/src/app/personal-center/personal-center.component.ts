import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../service/user.service";
import {User} from "../../entity/user";

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  modalVisible = false;
  alertMessage: string = '';
  userRole: string = '';
  passwordForm!: FormGroup;
  user: any = {};

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) {
    this.setUserRole();
    this.getUser();
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.checkPasswords });
  }

  checkPasswords: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword) {
      if (newPassword.value !== confirmPassword.value) {
        return { notSame: true };
      }
    }
    return null;
  };

  getUser(): void {
    this.userService.getUserInfo().subscribe(user => this.user = user);
  }

  loadUserProfile() {
    this.userService.getUserInfo().subscribe(
      data => {
        this.user = data;
        this.setUserRole();
      },
      error => {
        console.error('Error loading user profile', error);
      }
    );
  }

  setUserRole() {
    switch (this.user.role) {
      case 1:
        this.userRole = '学生';
        break;
      case 2:
        this.userRole = '管理员';
        break;
      default:
        this.userRole = '超级管理员';
    }
  }

  openModal() {
    this.modalVisible = true;
    this.alertMessage = '';
  }

  closeModal() {
    this.modalVisible = false;
    this.alertMessage = '';
  }

  submitChange(): void {
    console.log('Password Form State:', this.passwordForm);
    if (this.passwordForm.invalid) {
      console.log('Form is invalid, checking individual controls...');
      // 检查当前密码控件
      if (this.passwordForm.get('currentPassword')?.invalid) {
        console.log('Current Password control is invalid:', this.passwordForm.get('currentPassword'));
        this.alertMessage = '请输入当前密码';
        return;
      }
      // 检查新密码控件
      if (this.passwordForm.get('newPassword')?.invalid) {
        console.log('New Password control is invalid:', this.passwordForm.get('newPassword'));
        this.alertMessage = '新密码至少6位';
        return;
      }
      // 检查确认密码控件
      if (this.passwordForm.get('confirmPassword')?.invalid) {
        console.log('Confirm Password control is invalid:', this.passwordForm.get('confirmPassword'));
        this.alertMessage = '新密码不一致';
        return;
      }
      // 如果以上都没有问题，检查自定义验证器
      if (this.passwordForm.errors?.notSame) {
        console.log('Custom validator failed:', this.passwordForm.errors);
        this.alertMessage = '新密码和确认密码不一致';
        return;
      }
      // 如果这里都没有问题，可能是其他原因导致表单无效
      this.alertMessage = '表单无效，请检查输入';
      return;
    }

    const formData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(formData)
      .subscribe(
        response => {
          if (response['status'] === 'success') {
            this.alertMessage = response['msg'];
            this.modalVisible = false;
          } else {
            this.alertMessage = response['msg'];
          }
        },
        error => {
          this.alertMessage = '网络错误，请重试';
        }
      );
  }
}
