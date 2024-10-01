import { Component, OnInit } from '@angular/core';
import { PersonalCenterService} from "../../service/personal-center.service";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  user = {
    name: '温靖靖',
    username: 'wen',
    role: 0,
    clazz: '计算机科学',
    school: '河北工业大学'
  };
  modalVisible = false;
  alertMessage: string = '';
  userRole: string = '';

  constructor(private http: HttpClient, private UserService: UserService) {
    this.setUserRole();
  }

  ngOnInit(): void {
        throw new Error('Method not implemented.');
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

  submitChange(form: any) {
    if (form.invalid) {
      return;
    }

    const formData = {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    };

    this.http.post('/api/profile/changePassword', formData)
      .subscribe(
        response  => {
          // @ts-ignore
          if (response['status'] === 'success') {
            // @ts-ignore
            this.alertMessage = response['msg'];
            this.modalVisible = false;
          } else {
            // @ts-ignore
            this.alertMessage = response['msg'];
          }
        },
        error => {
          this.alertMessage = '网络错误，请重试';
        }
      );
  }
}
