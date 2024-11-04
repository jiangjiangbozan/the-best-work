import { Component, OnInit } from '@angular/core';
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
    school_id: new FormControl(0),
    semester_name: new FormControl(),
  });

  semesters: Semester[] = [];
  pageData = {
    size: 5,
    tolalElementsOfData: 1,
    currentPage: 1,
    totalPages: 0,
    first: true,
    last: false
  };
  schools: any[] = [];
  data = {
    school_id: 0,
    semester_name: '',
    currentPage: 1,
    size: 5
  };
  pages: number[] = [];
  showAllSchoolsInSearch = true;

  constructor(private semesterService: SemesterService, private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    Notiflix.Loading.standard('学期的数据正在努力地加载中，请稍候');
    combineLatest([
      this.schoolService.getSchoolNames(),
    ]).subscribe(([schools]) => {
      this.schools = schools;
      this.loadSemesters();
    });
  }

  loadSemesters() {
    this.updateDataFromForm();
    this.semesterService.searchSemsters(this.data).subscribe((data) => {
      this.updatePageData(data.tolalElementsOfData);
      this.semesters = data.semesters;
      Notiflix.Loading.remove();
    });
  }

  updateDataFromForm() {
    this.data.school_id = this.formGroup.get('school_id')?.value;
    this.data.semester_name = this.formGroup.get('semester_name')?.value;
    this.data.currentPage = this.pageData.currentPage;
  }

  updatePageData(totalElementsOfData: number) {
    this.pageData.tolalElementsOfData = totalElementsOfData;
    this.pageData.totalPages = Math.ceil(totalElementsOfData / this.pageData.size);
    this.pages = Array.from({ length: this.pageData.totalPages }, (_, i) => i + 1);
    this.pageData.first = this.pageData.currentPage === 1;
    this.pageData.last = this.pageData.currentPage === this.pageData.totalPages;
  }

  onSubmit() {
    this.loadSemesters();
  }

  onPageChange(currentPage: number) {
    this.pageData.currentPage = currentPage;
    this.loadSemesters();
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
          this.loadSemesters();
        }, error => {
          Notiflix.Notify.failure('删除学期失败，请稍后再试。');
        });
      }
    );
  }

  onPreviousPage() {
    if (!this.pageData.first) {
      this.onPageChange(this.pageData.currentPage - 1);
    }
  }

  onNextPage() {
    if (!this.pageData.last) {
      this.onPageChange(this.pageData.currentPage + 1);
    }
  }
}
