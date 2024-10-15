import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SchoolService} from "../../service/school.service";
import {MatDialog} from "@angular/material/dialog";
import { AddSchoolPopupComponent } from "./add-school-popup/add-school-popup.component";
import * as Notiflix from "notiflix";

interface School {
  id: number;
  name: string;
}

interface SchoolsResponse {
  data: School[];
  total: number;
}

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
  totalItems: number = 0; // 总记录数（从后端获取）
  totalPages: number = 1; // 总页数（计算得出）

  constructor(private http: HttpClient, private schoolService: SchoolService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchSchools();
  }

  fetchSchools(): void {
    const params = new URLSearchParams();
    params.set('page', this.currentPage.toString());
    params.set('size', this.pageSize.toString());
    if (this.schoolFilter) {
      params.set('school', this.schoolFilter);
    }

    this.schoolService.getSchools(this.currentPage, this.pageSize, this.schoolFilter).subscribe(
        (response: SchoolsResponse) => {
          this.schools = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        },
        error => {
          console.error('Error fetching schools:', error);
        }
    );
  }

  openAddSchoolDialog(): void {
    const dialogRef = this.dialog.open(AddSchoolPopupComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // 检查是否有结果返回
        Notiflix.Loading.standard('正在检查学校名称...'); // 显示加载提示

        this.schoolService.checkSchoolNameExists(result.name).subscribe(
          (response) => {
            Notiflix.Loading.remove(); // 移除加载提示
            if (response.exists) {
              // 如果学校名称已存在，则显示错误消息
              Notiflix.Notify.warning('该学校名称已存在，请选择其他名称！');
            } else if (response.error) {
              // 如果有错误信息
              Notiflix.Notify.failure(`检查学校名称时发生错误：${response.error}`);
            } else {
              // 学校名称不存在，可以进行添加操作
              Notiflix.Loading.standard('正在添加学校...');
              this.schoolService.addSchool(result).subscribe(
                (response) => {
                  Notiflix.Loading.remove();
                  console.log('School added successfully:', response);
                  this.fetchSchools(); // 成功添加后刷新列表
                  Notiflix.Notify.success('学校添加成功！');
                },
                (error) => {
                  Notiflix.Loading.remove();
                  console.error('Error adding school:', error);
                  Notiflix.Notify.failure('添加学校失败，请重试！');
                }
              );
            }
          },
          (error) => {
            Notiflix.Loading.remove(); // 确保在发生错误时也移除加载提示
            console.error('Error checking school name:', error);
            Notiflix.Notify.failure('检查学校名称时发生错误，请重试！');
          }
        );
      } else {
        Notiflix.Loading.remove(); // 如果用户取消了对话框，也移除加载提示
      }
    });
  }

  onChangePage(page: number): void {
    this.currentPage = page;
    this.fetchSchools();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.innerText.trim().replace(' 条', ''), 10);
    this.fetchSchools();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

}
