import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { SharedDataService } from "../../service/shared-data.service";
import * as Notiflix from "notiflix";
import {PersonalCenterService} from "../../service/personal-center.service";

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

  constructor(private personalCenterService: PersonalCenterService, private fb: FormBuilder, private share: SharedDataService) {
    this.setUserRole();
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.checkPasswords });
  }

  ngOnInit(): void {
    Notiflix.Loading.standard('您的相关数据正在努力地加载中，请稍候');
    this.loadUserProfile();
    this.share.currentClazzName.subscribe((clazz_name) => {
      this.clazz_name = clazz_name;
    });
    this.share.currentSchoolName.subscribe((school_name) => {
      this.school_name = school_name;
      // ('profile', this.school_name, school_name);
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

  loadUserProfile() {
    this.personalCenterService.getUserInfo().subscribe(
      data => {
        this.user = data;
        this.setUserRole();
        Notiflix.Notify.success("恭喜您！加载用户信息成功。");
        Notiflix.Loading.remove(); // 移除加载提示
      },
      error => {
        Notiflix.Loading.remove(); // 移除加载提示
        Notiflix.Notify.failure("加载用户信息失败，请稍后再试。");
      }
    );
  }

  setUserRole() {
    switch (this.user.role) {
      case 0:
        this.userRole = '学生';
        break;
      case 1:
        this.userRole = '管理员';
        break;
      default:
        this.userRole = '超级管理员';
    }
  }

  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  submitChange(): void {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.get('currentPassword')?.pristine && this.passwordForm.get('newPassword')?.pristine && this.passwordForm.get('confirmPassword')?.pristine) {
        Notiflix.Notify.failure("表单未填写完整，请填写所有字段。");
      } else if (this.passwordForm.get('currentPassword')?.invalid) {
        Notiflix.Notify.failure("请输入当前密码。");
      } else if (this.passwordForm.get('newPassword')?.invalid) {
        Notiflix.Notify.failure("新密码至少3位。");
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
    };

    this.personalCenterService.changePassword(this.user.id, formData)
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
