
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { User } from 'src/entity/user';


@Component({
  selector: 'app-template-up',
  templateUrl: './template-up.component.html',
  styleUrls: ['./template-up.component.css']
})
export class TemplateUpComponent implements OnInit {
  @Output()
  beLogout = new EventEmitter<any>();

   user = JSON.parse(sessionStorage.getItem('user')!) as User;
  constructor() { }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.beLogout.emit();
  }

}
