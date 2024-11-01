import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor(private schoolService: SchoolService) { }

  ngOnInit(): void {
  }

  deleteSchool(): void {
    Notiflix.Confirm.show(
      '确认删除',
      '您确定要删除这所学校吗？',
      '是',
      '否',
      () => {
        // 用户确认删除
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
            console.error('Error deleting school:', error);
          }
        );
      },
    );
  }

}
