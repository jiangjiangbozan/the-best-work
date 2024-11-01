import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SemesterService } from 'src/service/semester.service';
import { Semester } from 'src/entity/semester';
import { SchoolService } from 'src/service/school.service';
import { combineLatest } from 'rxjs';
import * as Notiflix from 'notiflix';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-semester-manage',
  templateUrl: './semester-manage.component.html',
  styleUrls: ['./semester-manage.component.css']
})
export class SemesterManageComponent implements OnInit {

  formGroup = new FormGroup({
    school_id: new FormControl(),
    semester_name: new FormControl(),
  });

  semesters: Semester[] = [];
  pageData = {
    size: 5,
    tolalElementsOfData: 0,
    currentPage: 1,
    totalPages: 2,
    first: true,
    last: false
  };
  schools = [{
    name: '',
    id: 0
  }];
  data = {
    school_id: 0,
    semester_name: '',
    currentPage: this.pageData.currentPage,
    size: this.pageData.size
  };
  pages: number[] = [];
  showAllSchoolsInSearch = true;

  constructor(private semesterService: SemesterService, private schoolService: SchoolService) { }

  ngOnInit(): void {
    Notiflix.Loading.standard('数据加载中，请稍候');
    combineLatest([
      this.schoolService.getSchoolNames(),
    ]).subscribe(([schools]) => {
      this.schools = schools;
      this.loadByPage(this.pageData.currentPage);
    });
  }

  onSubmit() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.loadByPage(this.pageData.currentPage);
  }

  onPage(currentPage: number) {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.pageData.currentPage = currentPage;
    this.loadByPage(currentPage);
  }

  onDelect(semester_id: number) {
    Notiflix.Confirm.show(
      '确认删除',
      '您确定要删除这个学期吗？',
      '是',
      '否',
      () => {
        this.semesterService.delectSemster(semester_id).subscribe(() => {
          Notiflix.Notify.success('学期删除成功！');
          this.loadByPage(this.pageData.currentPage);
        }, error => {
          Notiflix.Notify.failure('删除学期失败，请稍后再试。');
        });
      }
    );
  }

  frontPage() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.pageData.currentPage = this.pageData.currentPage - 1;
    this.loadByPage(this.pageData.currentPage);
  }

  nextPage() {
    Notiflix.Loading.standard('数据加载中，请稍候');
    this.pageData.currentPage = this.pageData.currentPage + 1;
    this.loadByPage(this.pageData.currentPage);
  }

  loadByPage(currentPage: number) {
    this.data.currentPage = currentPage;
    this.data.school_id = this.formGroup.get('school_id')?.value;
    this.data.semester_name = this.formGroup.get('semester_name')?.value;
    this.semesterService.searchSemsters(this.data).subscribe((data) => {
      this.definePageData(data.tolalElementsOfData);
      this.semesters = data.semesters;
      Notiflix.Loading.remove();
    });
  }

  definePageData(tolalElementsOfData: number) {
    this.pageData.tolalElementsOfData = tolalElementsOfData;
    this.pageData.totalPages = Math.ceil(this.pageData.tolalElementsOfData / this.pageData.size);
    this.pages = Array.from({ length: this.pageData.totalPages }, (_, i) => i + 1);
    this.pageData.first = this.pageData.currentPage === 1;
    this.pageData.last = this.pageData.currentPage === this.pageData.totalPages;
  }

}
