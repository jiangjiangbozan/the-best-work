import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-school-manage',
  templateUrl: './school-manage.component.html',
  styleUrls: ['./school-manage.component.css']
})
export class SchoolManageComponent implements OnInit {

  schools: any[] = []; // 学校列表
  schoolFilter: string = ''; // 学校过滤器
  pageSize: number = 10; // 每页显示的记录数
  currentPage: number = 1; // 当前页码
  totalItems: number = 0; // 总记录数
  totalPages: number = 10;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSchools();
  }

  fetchSchools(): void {
    let url = `api/schools?page=${this.currentPage}&size=${this.pageSize}`;

    if (this.schoolFilter) {
      url += `&school=${this.schoolFilter}`;
    }

    this.http.get<any>(url).subscribe(response => {
      this.schools = response.data;
      this.totalItems = response.total;
    });
  }

  onChangePage(page: number): void {
    this.currentPage = page;
    this.fetchSchools();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.fetchSchools();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= Math.ceil(this.totalItems / this.pageSize); i++) {
      pages.push(i);
    }
    return pages;
  }

  onDelete(id: number): void {
    if (confirm('确定要删除这个学校吗?')) {
      this.http.delete(`api/school/${id}`).subscribe(() => {
        this.fetchSchools();
      });
    }
  }

}
