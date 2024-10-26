import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import * as Notiflix from 'notiflix';
import {SchoolService} from "../../../service/school.service";

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  @Output() onDeleteSuccess = new EventEmitter<void>();
  @Input() schoolId!: number; // 从父组件接收学校ID

  constructor(private http: HttpClient, private router: Router,private schoolService: SchoolService) { }

  ngOnInit(): void {
  }

  deleteSchool(): void {
    Notiflix.Loading.standard('正在删除学校...');
    this.schoolService.deleteSchool(this.schoolId).subscribe(
      (response) => {
        Notiflix.Loading.remove();
        Notiflix.Notify.success('学校删除成功！');
        this.onDeleteSuccess.emit();
      },
      (error) => {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('删除学校失败，请重试！');
        console.log(error);
        console.error('Error deleting school:', error);
      }
    );
  }

}
