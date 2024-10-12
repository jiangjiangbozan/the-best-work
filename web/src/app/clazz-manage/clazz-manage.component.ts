import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-clazz-manage',
  templateUrl: './clazz-manage.component.html',
  styleUrls: ['./clazz-manage.component.css']
})
export class ClazzManageComponent implements OnInit {
  schools: any[] = []; // 学校列表
  clazzes: any[] = []; // 班级列表
  selectedSchoolId: string = ''; // 选中的学校ID
  clazzFilter: string = ''; // 班级过滤器
  pageSize: number = 10; // 每页显示的记录数
  currentPage: number = 1; // 当前页码
  totalItems: number = 0; // 总记录数
  totalPages: number = 10;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSchools();
    this.fetchClazzes();
  }

  fetchSchools(): void {
    this.http.get<any[]>('api/schools').subscribe(schools => {
      this.schools = schools;
    });
  }

  fetchClazzes(): void {
    let url = `api/clazzes?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.selectedSchoolId) {
      url += `&school_id=${this.selectedSchoolId}`;
    }

    if (this.clazzFilter) {
      url += `&clazz=${this.clazzFilter}`;
    }

    this.http.get<any>(url).subscribe(response => {
      this.clazzes = response.data;
      this.totalItems = response.total;
    });
  }

  onChangeSchool(event: any): void {
    this.selectedSchoolId = event.target.value;
    this.fetchClazzes();
  }

  onChangePage(page: number): void {
    this.currentPage = page;
    this.fetchClazzes();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.fetchClazzes();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= Math.ceil(this.totalItems / this.pageSize); i++) {
      pages.push(i);
    }
    return pages;
  }

  onDelete(id: number): void {
    if (confirm('确定要删除这个班级吗?')) {
      this.http.delete(`api/clazz/${id}`).subscribe(() => {
        this.fetchClazzes();
      });
    }
  }
}
