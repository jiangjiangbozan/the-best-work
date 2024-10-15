
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { User } from 'src/entity/user';
import {UserService} from '../../service/user.service';
import * as Notiflix from 'notiflix';
@Component({
  selector: 'app-template-up',
  templateUrl: './template-up.component.html',
  styleUrls: ['./template-up.component.css']
})
export class TemplateUpComponent implements OnInit {
  @Output()
  beLogout = new EventEmitter<any>();

  user = JSON.parse(sessionStorage.getItem('user')!) as User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onLogout(): void {
    Notiflix.Loading.standard('请稍候');
    this.userService.logout().subscribe(() => {
      this.beLogout.emit();
      Notiflix.Loading.remove();
    })
  }

}
