import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { User } from 'src/entity/user';
import { UserService } from 'src/service/user.service';
import * as Notiflix from 'notiflix';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  formGroup = new FormGroup({
    username :  new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    clazz_id: new FormControl(null, Validators.required),
    role : new FormControl(null, Validators.required)
  });
  user = {
    id: 0,
    username :  '',
    name: '',
    clazz_id: 0,
    role : 0
  }
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
        //获取id
        const id = this.activatedRoute.snapshot.params.id;
        this.user.id = id;
        this.userService.getUser(id)
        .subscribe((user) => {
          this.formGroup.get('role')?.setValue(user.role);
          this.formGroup.get('username')?.setValue(user.username);
          this.formGroup.get('name')?.setValue(user.name);
          this.formGroup.get('clazz_id')?.setValue(user.clazz_id);
        })
  }

  onSubmit() {
    Notiflix.Loading.standard('正在编辑并更新用户的数据中，请稍候');
    this.user.role = this.formGroup.get('role')?.value;
    this.user.username = this.formGroup.get('username')?.value;
    this.user.name = this.formGroup.get('name')?.value;
    this.user.clazz_id = this.formGroup.get('clazz_id')?.value;
    this.userService.updateUser(this.user)
    .subscribe(() => {
      Notiflix.Loading.remove();
      this.router.navigate(['user']);
      Notiflix.Report.success(
        '编辑用户成功',
        '恭喜您！',
        '好的'
      );
    },(error) => {
      Notiflix.Loading.remove();
      Notiflix.Report.failure(
        '编辑用户失败',
        '抱歉，请重新尝试编辑用户信息',
        '好的'
      );
    })
  }
}
