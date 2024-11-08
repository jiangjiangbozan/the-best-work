import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Notiflix from "notiflix";
import {AddComponent} from "./add/add.component";
import {MatDialog} from "@angular/material/dialog";
import {ClazzService} from "../../service/clazz.service";
import {EditComponent} from "./edit/edit.component";

interface School {
  id: string;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
  schoolId: string;
  schoolName: string;
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
  totalPages: number = 1;

  constructor(private http: HttpClient, private dialog: MatDialog, private clazzService: ClazzService) {}

  ngOnInit(): void {
    this.loadSchools();
    this.loadData();
  }

  openAddClazzDialog() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '250px',
      data: { schools: this.schools }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // 检查是否有结果返回
        Notiflix.Loading.standard('正在检查班级名称...');
        this.clazzService.checkClazzNameExists(result.name, result.schoolId).subscribe(
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
                  this.fetchClazzes(); // 成功添加后刷新列表
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

  openEditClazzDialog(clazz: Classroom): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '250px',
      data: { clazz }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchClazzes(); // 成功编辑后刷新列表
      }
    });
  }

  loadData(): void {
    Notiflix.Loading.standard('班级的数据正在努力地加载中，请稍候');

    this.fetchSchools()
      .pipe(
        tap(() => this.fetchClazzes()),
        catchError(error => {
          Notiflix.Loading.remove();
          this.error = '数据加载失败，请稍后再试。';
          return of([]); // 返回空数组以避免错误中断流
        })
      )
      .subscribe(() => {
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

  // 加载学校列表
  loadSchools(): void {
    this.http.get<School[]>('/api/school/getSchools')
      .pipe(
        catchError(error => {
          console.error('加载学校列表失败:', error);
          Notiflix.Notify.failure('加载学校列表失败，请稍后再试。');
          return of([]); // 返回空数组以避免错误中断流
        })
      )
      .subscribe(schools => {
        this.schools = schools;
      });
  }

  // 处理查询
  handleQuery(): void {
    this.currentPage = 1;
    this.fetchClazzes();
  }

  // 加载班级数据，现在接受学校和班级名称作为参数
  fetchClazzes(): void {
    const url = `api/clazz/index`;
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    if (this.selectedSchoolId) {
      params = params.append('school_id', this.selectedSchoolId);
    }

    if (this.clazzFilter) {
      params = params.append('clazz', this.clazzFilter);
    }

    this.http.get<ClassroomResponse>(url, { params })
      .pipe(
        tap(response => {
          this.clazzes = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(response.total / this.pageSize);
        }),
        catchError(error => {
          console.error('加载班级数据失败:', error);
          Notiflix.Notify.failure('加载班级数据失败，请稍后再试。');
          return of({ data: [], total: 0 }); // 返回空数据以避免错误中断流
        })
      )
      .subscribe();
  }

  onChangeSchool(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSchoolId = select.value;
    this.clazzFilter = '';
    this.fetchClazzes();
  }

  onDelete(id: number): void {
    Notiflix.Confirm.show(
      '确认删除',
      '您确定要删除这个班级吗？',
      '是',
      '否',
      () => {
        Notiflix.Loading.standard('正在删除学校...');
        // 用户确认删除
        this.http.delete(`api/clazz/delete?id=${id}`)
          .pipe(
            catchError(error => {
              Notiflix.Loading.remove();
              console.error('删除班级失败:', error);
              Notiflix.Notify.failure('删除班级失败，请稍后再试。');
              return of(null); // 返回null以避免错误中断流
            })
          )
          .subscribe(response => {
            // 检查响应，如果删除成功则显示成功提示
            if (response) {
              Notiflix.Loading.remove();
              Notiflix.Notify.success('恭喜您！班级删除成功！');
            }
            this.fetchClazzes(); // 重新获取班级列表
          });
      },
    );
  }

  handlePageChange(event: { page: number, pageSize: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.fetchClazzes();
  }
}
