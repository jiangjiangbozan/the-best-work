import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-semester-manage',
  templateUrl: './semester-manage.component.html',
  styleUrls: ['./semester-manage.component.css']
})
export class SemesterManageComponent implements OnInit {

  terms: any[] = []; // 学期列表
  schools: any[] = []; // 学校列表
  selectedSchoolId: string = ''; // 选中的学校ID
  termFilter: string = ''; // 学期过滤器
  pageSize: number = 10; // 每页显示的记录数
  currentPage: number = 1; // 当前页码
  totalItems: number = 0; // 总记录数
  totalPages: number = 10;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchTerms();
    this.fetchSchools();
  }

  fetchTerms(): void {
    let url = `api/terms?page=${this.currentPage}&pageSize=${this.pageSize}`;

    if (this.selectedSchoolId) {
      url += `&school_id=${this.selectedSchoolId}`;
    }

    if (this.termFilter) {
      url += `&term=${this.termFilter}`;
    }

    this.http.get<any>(url).subscribe(response => {
      this.terms = response.data;
      this.totalItems = response.total;
    });
  }

  fetchSchools(): void {
    this.http.get<any>('api/schools').subscribe(response => {
      this.schools = [{ id: '', school: '所有学校' }].concat(response);
    });
  }

  onChangePage(page: number): void {
    this.currentPage = page;
    this.fetchTerms();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.fetchTerms();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= Math.ceil(this.totalItems / this.pageSize); i++) {
      pages.push(i);
    }
    return pages;
  }

  onDelete(id: number): void {
    if (confirm('确定要删除这个学期吗?')) {
      this.http.delete(`api/term/${id}`).subscribe(() => {
        this.fetchTerms();
      });
    }
  }

}
