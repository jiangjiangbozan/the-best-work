import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Notiflix from "notiflix";
import {AddComponent} from "./add/add.component";
import {MatDialog} from "@angular/material/dialog";
import {ClazzService} from "../../service/clazz.service";

interface School {
  id: string;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
  schoolId: string;
  schoolName?: string;
}

interface ClassroomResponse {
  data: Classroom[];
  total: number;
}

@Component({
  selector: 'app-clazz-manage',
  templateUrl: './clazz-manage.component.html',
  styleUrls: ['./clazz-manage.component.css']
})
export class ClazzManageComponent implements OnInit {
  schools: School[] = [];
  clazzes: Classroom[] = [];
  selectedSchoolId: string = '';
  clazzFilter: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;
  loading: boolean = false;
  error: string | null = null;
  totalPages: number = 10;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private clazzService: ClazzService,) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  openAddClazzDialog() {
    console.log('openAddClazzDialog');
    const dialogRef = this.dialog.open(AddComponent, {
      width: '250px',
      data: { schools: this.schools } // 确保这里传递的是正确的学校列表数据
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // 检查是否有结果返回
        Notiflix.Loading.standard('正在检查班级名称...');
        this.clazzService.checkClazzNameExists(result.name).subscribe(
          (response) => {
            Notiflix.Loading.remove();
            if (response.exists) {
              Notiflix.Notify.warning('该班级名称已存在，请选择其他名称！');
            } else if (response.error) {
              Notiflix.Notify.failure(`检查班级名称时发生错误：${response.error}`);
            } else {
              Notiflix.Loading.standard('正在添加班级...');
              this.clazzService.addClazz(result).subscribe(
                (response) => {
                  Notiflix.Loading.remove();
                  console.log('School added successfully:', response);
                  this.fetchSchools(); // 成功添加后刷新列表
                  Notiflix.Notify.success('班级添加成功！');
                },
                (error) => {
                  Notiflix.Loading.remove();
                  console.error('Error adding clazz:', error);
                  Notiflix.Notify.failure('添加班级失败，请重试！');
                }
              );
            }
          },
          (error) => {
            Notiflix.Loading.remove();
            console.error('Error checking clazz name:', error);
            Notiflix.Notify.failure('检查班级名称时发生错误，请重试！');
          }
        );
      } else {
        Notiflix.Loading.remove();
      }
    });
  }

  loadData(): void {
    this.loading = true;
    Notiflix.Loading.standard('正在加载数据...');

    this.fetchSchools()
      .pipe(
        tap(() => this.fetchClazzes()),
        catchError(error => {
          this.loading = false;
          Notiflix.Loading.remove();
          this.error = '数据加载失败，请稍后再试。';
          return of([]); // 返回空数组以避免错误中断流
        })
      )
      .subscribe(() => {
        this.loading = false;
        Notiflix.Loading.remove();
        this.error = null; // 清除错误消息
      });
  }

  fetchSchools(): any {
    return this.http.get<School[]>('/api/school/index')
      .pipe(
        catchError(error => {
          console.error('班级数据加载失败:', error);
          Notiflix.Notify.failure('班级数据加载失败。');
          return of([]); // 返回空数组以避免错误中断流
        })
      );
  }

  fetchClazzes(): void {
    const url = `api/clazz/index`;
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());
    if (this.selectedSchoolId) {
      params.append('school_id', this.selectedSchoolId);
    }
    if (this.clazzFilter) {
      params.append('name', this.clazzFilter);
    }

    this.http.get<ClassroomResponse>(url, { params })
      .pipe(
        tap(response => {
          this.clazzes = response.data;
          this.totalItems = response.total;
        }),
        catchError(error => {
          console.error('班级数据加载失败:', error);
          Notiflix.Notify.failure('班级数据加载失败，请稍后再试。');
          return of({ data: [], total: 0 }); // 返回空数据以避免错误中断流
        })
      )
      .subscribe();
  }

  onChangeSchool(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSchoolId = select.value;
    this.fetchClazzes();
  }

  onChangePage(page: number): void {
    this.currentPage = page;
    this.fetchClazzes();
  }

  onPageSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pageSize = parseInt(input.value, 10);
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
      this.http.delete(`api/clazz/delete/${id}`)
        .pipe(
          catchError(error => {
            console.error('删除班级失败:', error);
            Notiflix.Notify.failure('删除班级失败，请稍后再试。');
            return of(null); // 返回null以避免错误中断流
          })
        )
        .subscribe(() => {
          this.fetchClazzes();
        });
    }
  }
}
