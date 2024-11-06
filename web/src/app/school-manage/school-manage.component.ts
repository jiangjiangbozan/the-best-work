import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../service/school.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSchoolPopupComponent } from './add-school-popup/add-school-popup.component';
import * as Notiflix from "notiflix";
import { EditComponent } from './edit/edit.component';

interface School {
  id: number;
  name: string;
}

interface SchoolsResponse {
  data: School[];
  total: number;
}

interface CheckSchoolResponse {
  exists: boolean;
}


@Component({
  selector: 'app-school-manage',
  templateUrl: './school-manage.component.html',
  styleUrls: ['./school-manage.component.css']
})
export class SchoolManageComponent implements OnInit {
  schools: School[] = []; // 学校列表
  schoolFilter: string = ''; // 学校过滤器
  pageSize: number = 10; // 每页显示的记录数
  currentPage: number = 1; // 当前页码
  totalItems: number = 0; // 总记录数（从后端获取）
  totalPages: number = 1; // 总页数（计算得出）
  filteredSchools: School[] = []; // 过滤后的学校列表
  start: number = 0;
  end: number = 0;

  constructor(private schoolService: SchoolService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchSchools();
  }

  fetchSchools(): void {
    Notiflix.Loading.standard('学校的数据正在努力地加载中，请稍候');
    this.schoolService.getSchools(this.currentPage, this.pageSize, this.schoolFilter).subscribe(
      (response: SchoolsResponse) => {
        this.schools = response.data;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.filteredSchools = this.schools;
        this.updatePageRange();
        Notiflix.Loading.remove();
      },
      error => {
        console.error('Error fetching schools:', error);
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('加载学校数据失败，请稍后再试。');
      }
    );
  }

  openAddSchoolDialog(): void {
    const dialogRef = this.dialog.open(AddSchoolPopupComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 检查学校名称是否为空
        if (!result.name.trim()) {
          // 如果学校名称为空，则通知用户
          Notiflix.Notify.warning('学校名称不能为空，请输入有效的学校名称。');
          return;
        }
        // 用户输入了学校名称，现在检查这个名称是否已经存在
        this.schoolService.checkSchoolNameExists(result.name).subscribe(
          (response: CheckSchoolResponse) => {
            if (response.exists) {
              // 如果学校名称已存在，则通知用户
              Notiflix.Notify.warning('该学校名称已存在，请使用不同的名称。');
            } else {
              // 如果学校名称不存在，则继续添加学校
              Notiflix.Loading.standard('正在添加学校...');
              this.schoolService.addSchool(result).subscribe(
                (response) => {
                  Notiflix.Loading.remove();
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
            // 检查学校名称是否存在时发生错误
            console.error('Error checking if school name exists:', error);
            Notiflix.Notify.failure('无法检查学校名称是否存在，请稍后再试。');
          }
        );
      }
    });
  }

  openEditSchoolDialog(school: School): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '250px',
      data: { school: school }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchSchools(); // 更新成功后刷新学校列表
      }
    });
  }


  handlePageChange(event: { page: number, pageSize: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.fetchSchools();
    this.updatePageRange();
  }

  updatePageRange(): void {
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = this.start + this.pageSize;
  }

  filterSchools(filter: string): void {
    this.schoolFilter = filter;
    this.currentPage = 1;
    this.fetchSchools();
  }
}
