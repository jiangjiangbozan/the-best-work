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

  search() {
    Notiflix.Loading.dots('正在加载...');
    // 创建一个临时变量来存储搜索结果
    let tempSearchResults: any[] = [];
    this.schoolService.searchSchools(this.searchName).subscribe(
      response => {
        Notiflix.Loading.remove();
        tempSearchResults = response.schools;
        if (tempSearchResults.length === 0) {
          Notiflix.Notify.warning('没有找到相关学校。');
        } else {
          this.onSearchComplete.emit(tempSearchResults);
          Notiflix.Notify.success('恭喜您，查询成功！');
        }
        // 在这里打印临时变量，确保在订阅完成后打印结果
        console.log('Search results:', tempSearchResults);
      },
      error => {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('抱歉，查询失败，请重试');
      }
    );
  }
}
