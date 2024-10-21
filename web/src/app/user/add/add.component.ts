import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { User } from 'src/entity/user';
import { UserService } from 'src/service/user.service';
import * as Notiflix from 'notiflix';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  formGroup = new FormGroup({
    username :  new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    clazz_id: new FormControl(null, Validators.required),
    role : new FormControl(null, Validators.required)
  });
  user = {
    username :  this.formGroup.get('username')?.value,
    name: this.formGroup.get('name')?.value,
    clazz_id: 0,
    role : this.formGroup.get('role')?.value
  }
 
  constructor(
    private userService: UserService,
    private router: Router 
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.user = {
        username :  this.formGroup.get('username')?.value,
        name: this.formGroup.get('name')?.value,
        clazz_id: this.formGroup.get('clazz_id')?.value,
        role : this.formGroup.get('role')?.value
      }
      this.userService.addUser(this.user)
      .subscribe(() =>{
        Notiflix.Loading.remove();
        this.router.navigate(['user']);
        Notiflix.Report.success(
          '添加用户成功',
          '"',
          '好的'
        );
      },(error) => {
        Notiflix.Loading.remove();
        Notiflix.Report.failure(
          '添加用户失败',
          '用户名重复',
          '好的'
        );
      })
  
  }
}
