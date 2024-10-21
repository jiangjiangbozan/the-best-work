import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as Notiflix from "notiflix";
import {SchoolService} from "../../../service/school.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchName: string = '';

  @Output() onSearchComplete = new EventEmitter<any[]>();

  constructor(private schoolService: SchoolService) { }

  ngOnInit(): void {
  }

  search(): void {
    if (this.searchName) {
      Notiflix.Loading.dots('正在加载...');
      this.schoolService.searchSchools(this.searchName).subscribe(
        (response) => {
          Notiflix.Loading.remove();
          const schools = response.schools;
          if (schools.length === 0) {
            Notiflix.Notify.warning('没有找到相关学校。');
          } else {
            this.onSearchComplete.emit(schools);
            Notiflix.Notify.success('恭喜您，查询成功！');
          }
        },
        (error) => {
          Notiflix.Loading.remove();
          Notiflix.Notify.failure('抱歉，查询失败，请重试');
        }
      );
    }
  }

}
