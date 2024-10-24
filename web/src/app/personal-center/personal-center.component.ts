import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../service/user.service";
import { SharedDataService } from "../../service/shared-data.service";
import * as Notiflix from "notiflix"; // 引入Notiflix库

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
      this.clazz_name = clazz_name;
    });
    this.share.currentSchoolName.subscribe((school_name) => {
      this.school_name = school_name;
    });
  }

  checkPasswords: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { notSame: true };
    }
    return null;
  };

  getUser(): void {
    this.userService.getAllUserInfo().subscribe(response => {
      if (response && response.userList && response.userList.data) {
        this.users = response.userList.data;
      } else {
        this.users = [];
      }
    }, error => {
      this.users = [];
      Notiflix.Notify.failure("网络错误，无法获取用户信息。");
    });
  }

  loadUserProfile() {
    this.userService.getUserInfo().subscribe(
      data => {
        this.user = data;
        this.setUserRole();
      },
      error => {
        Notiflix.Notify.failure("加载用户信息失败，请稍后再试。");
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
    if (this.passwordForm.invalid) {
      if (this.passwordForm.get('currentPassword')?.invalid) {
        Notiflix.Notify.failure("请输入当前密码。");
      } else if (this.passwordForm.get('newPassword')?.invalid) {
        Notiflix.Notify.failure("新密码至少6位。");
      } else if (this.passwordForm.get('confirmPassword')?.invalid || this.passwordForm.errors?.notSame) {
        Notiflix.Notify.failure("新密码和确认密码不一致。");
      } else {
        Notiflix.Notify.failure("表单无效，请检查输入。");
      }
      return;
    }

    const formData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
      // 不需要发送confirmPassword，因为它只是用于前端验证
    };

    this.userService.changePassword(this.user.id, formData)
      .subscribe(
        response => {
          if (response['status'] === 'success') {
            Notiflix.Notify.success(response['msg']);
            this.modalVisible = false;
          } else {
            Notiflix.Notify.failure(response['msg']);
          }
        },
        error => {
          Notiflix.Notify.failure("网络错误，请重试。");
        }
      );
  }
}
