
import {Component, EventEmitter, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-template-up',
  templateUrl: './template-up.component.html',
  styleUrls: ['./template-up.component.css']
})
export class TemplateUpComponent implements OnInit {
  @Output()
  beLogout = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.beLogout.emit();
  }

}
