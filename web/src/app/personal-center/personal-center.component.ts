import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../service/user.service";
import {SharedDataService} from "../../service/shared-data.service";

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
  users: any = [];
  clazz_name = '';
  school_name = '';

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder, private share: SharedDataService) {
    this.setUserRole();
    this.getUser();
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.checkPasswords });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.share.currentClazzName.subscribe((clazz_name) => {
      this.clazz_name= clazz_name;
    });
    this.share.currentSchoolName.subscribe((school_name) => {
      this.school_name = school_name;
    })
    // this.passwordForm = new FormGroup({
    //   currentPassword: new FormControl('', [Validators.required]),
    //   newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    //   confirmPassword: new FormControl('', [Validators.required])
    // }, { validators: this.checkPasswords });
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
    this.userService.getAllUserInfo().subscribe(response => {
        // 从响应中提取用户列表
        if (response && response.userList && response.userList.data) {
          const userList = response.userList.data;
          this.users = userList; // 假设 this.users 是一个数组，用于存储用户列表
        } else {
          console.error('Invalid response format:', response);
          this.users = []; // 或者处理错误情况，比如显示错误消息
        }
      },
      error => {
        console.error('Error fetching user info:', error);
        // 可以在这里添加额外的错误处理逻辑，比如显示错误消息给用户
        this.users = []; // 清空用户列表或显示错误状态
      }
    );
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

    // 如果表单有效，则继续提交逻辑
    const formData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmNewPassword: this.passwordForm.value.confirmPassword
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
