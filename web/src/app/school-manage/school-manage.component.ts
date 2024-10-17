import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SchoolService} from "../../service/school.service";
import {MatDialog} from "@angular/material/dialog";
import { AddSchoolPopupComponent } from "./add-school-popup/add-school-popup.component";
import * as Notiflix from "notiflix";
import {EditComponent} from "./edit/edit.component";
import {ActivatedRoute, Router} from "@angular/router";

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
  searchResults: any[] = [];


  constructor(private schoolService: SchoolService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchSchools();
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] || 1;
      this.pageSize = params['size'] || 10;
      this.fetchSchools();
    });
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
        this.schools = response.data; // 更新学校列表
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

  openEditSchoolDialog(school: any): void {
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
            this.fetchSchools(); // 更新成功后刷新学校列表
          },
          error => {
            Notiflix.Loading.remove();
            console.error('Error updating school:', error);
            Notiflix.Notify.failure('更新学校信息失败，请重试！');
          }
        );
      } else {
        Notiflix.Loading.remove(); // 用户取消对话框时移除加载提示
      }
    });
  }

  onSearchComplete(schools: any[]): void {
    console.log('Received search results:', schools);
    this.searchResults = schools;
    this.currentPage = 1;
    this.updateSchoolsFromSearchResults();
    this.displaySearchResults();
  }

  updateSchoolsFromSearchResults(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.schools = this.searchResults.slice(startIndex, endIndex);
    this.totalItems = this.searchResults.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.changeDetectorRef.detectChanges();
  }

  displaySearchResults(): void {
    console.log('Before slicing, search results length:', this.searchResults.length);
    if (this.searchResults.length > 0) {
      this.schools = this.searchResults.slice(0, this.pageSize);
      console.log('After slicing, schools length:', this.schools.length);
      this.totalItems = this.searchResults.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      console.log('Total pages:', this.totalPages);
    }
  }

  handlePageChange(event: { page: number, pageSize: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    // 触发页面重新加载
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, size: this.pageSize },
      queryParamsHandling: 'merge' // 或者 'preserve'
    }).then(() => {
      this.fetchSchools(); // 可选：重新加载数据
    });
  }

}
