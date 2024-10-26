import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SchoolService } from '../../service/school.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSchoolPopupComponent } from './add-school-popup/add-school-popup.component';
import * as Notiflix from "notiflix";
import { EditComponent } from './edit/edit.component';
import { ActivatedRoute } from '@angular/router';

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
  schools: School[] = []; // 学校列表
  schoolFilter: string = ''; // 学校过滤器
  pageSize: number = 10; // 每页显示的记录数
  currentPage: number = 1; // 当前页码
  totalItems: number = 0; // 总记录数（从后端获取）
  totalPages: number = 1; // 总页数（计算得出）
  allSchools: School[] = [];

  constructor(private schoolService: SchoolService, public dialog: MatDialog, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? Number(params['page']) : 1;
      this.pageSize = params['size'] ? Number(params['size']) : 10;
      this.loadSchools();
    });
    this.loadAllSchools();
  }

  loadSchools(): void {
    this.fetchSchools(this.schoolFilter);
  }

  fetchSchools(filter?: string): void {
    Notiflix.Loading.standard('学校的数据正在努力地加载中，请稍候');
    this.schoolService.getSchools(this.currentPage, this.pageSize, filter).subscribe(
      (response: SchoolsResponse) => {
        this.schools = response.data; // 更新学校列表
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        Notiflix.Loading.remove();
        this.changeDetectorRef.detectChanges(); // 触发变更检测
      },
      error => {
        console.error('Error fetching schools:', error);
        Notiflix.Loading.remove();
      }
    );
  }

  openAddSchoolDialog(): void {
    const dialogRef = this.dialog.open(AddSchoolPopupComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Notiflix.Loading.standard('正在添加学校...');
        this.schoolService.addSchool(result).subscribe(
          (response) => {
            Notiflix.Loading.remove();
            console.log('School added successfully:', response);
            this.loadSchools(); // 成功添加后刷新列表
            Notiflix.Notify.success('学校添加成功！');
          },
          (error) => {
            Notiflix.Loading.remove();
            console.error('Error adding school:', error);
            Notiflix.Notify.failure('添加学校失败，请重试！');
          }
        );
      } else {
        Notiflix.Loading.remove();
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
        Notiflix.Loading.standard('正在更新学校信息...');

        this.schoolService.updateSchool(school.id, result).subscribe(
          () => {
            Notiflix.Loading.remove();
            Notiflix.Notify.success('学校信息更新成功！');
            this.loadSchools(); // 更新成功后刷新学校列表
          },
          error => {
            Notiflix.Loading.remove();
            console.error('Error updating school:', error);
            Notiflix.Notify.failure('更新学校信息失败，请重试！');
          }
        );
      } else {
        Notiflix.Loading.remove();
      }
    });
  }

  handlePageChange(event: { page: number, pageSize: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.loadSchools();
  }

  loadAllSchools(): void {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.schoolService.getSchools().subscribe(
      (response: SchoolsResponse) => {
        this.allSchools = response.data; // 加载所有学校
        this.filterSchools(this.schoolFilter); // 初始过滤
        Notiflix.Loading.remove();
      },
      error => {
        console.error('Error fetching schools:', error);
        Notiflix.Loading.remove();
      }
    );
  }

  filterSchools(filter: string): void {
    if (filter) {
      // 如果有过滤器，则在前端过滤学校列表
      this.schools = this.allSchools.filter(school =>
        school.name.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      // 如果没有过滤器，则显示所有学校
      this.schools = [...this.allSchools];
    }
    // 由于是前端过滤，不需要重新计算总页数
    // 但如果需要，可以重新设置 totalItems 和 totalPages
    this.totalItems = this.schools.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.changeDetectorRef.detectChanges(); // 触发变更检测
  }
}
