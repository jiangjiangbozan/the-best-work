import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { SharedDataService } from '../../service/shared-data.service';
import { Confirm } from 'notiflix';
import { Course } from 'src/entity/course';
import * as Notiflix from 'notiflix';
@Component({
  selector: 'app-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.css']
})
export class CourseManageComponent implements OnInit {

  user_id = 0;

  pageData ={
    size : 5,
    tolalElementsOfData : 0,
    currentPage: 1,
    totalPages:2,
    first:true,
    last: false
  }
  pages : number[] =[];

  courses: Course[] = [{
    id: 0,
    user_id: 0,
    name: '',
    start_week: 1,
    end_week: 1,
    section: 1,
    date: 1,
    semester_id : 3
  }];

  courseData = {
    id: this.user_id,
    name: '' ,
    semester_id: 0,
    currentPage: this.pageData.currentPage,
    size : this.pageData.size
  };

  current_semester_id = 0;
  semesters = Array();
  constructor(
    private courseService: CourseService,
    private sharedDataService:SharedDataService
  ) {
  }

  ngOnInit(): void {
    Notiflix.Loading.standard('您的课程的数据正在努力地加载中，请稍候');
    this.sharedDataService.currentId.subscribe((id) => {
      this.user_id = id;
      this.courseData.id = id;
    });
    this.sharedDataService.currentSemesterId
    .subscribe((semester_id) => {
      this.courseData.semester_id = semester_id;
      this.current_semester_id = semester_id;
      this.courseService.searchCourses(this.courseData)
      .subscribe((data) => {
        this.courses= data.courses;
        this.definePageData(data.tolalElementsOfData);
        Notiflix.Loading.remove();
      },(error) => {
        Notiflix.Loading.remove();
      })
    });
    this.sharedDataService.currentSemesters
    .subscribe((semesters) => {
      this.semesters = semesters;
    },(error) => {
      Notiflix.Loading.remove();
    });
  }

  onDelect(id: number) {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.courseService.delectCourse(id)
          .subscribe(() => {
            this.ngOnInit()
          })
      })
  }

  onSubmit() {
  this.loadByPage(this.pageData.currentPage);
  }


  definePageData(tolalElementsOfData: number) {
    let begin;
    let maxCount;
    this.pageData.tolalElementsOfData = tolalElementsOfData;
    this.pageData.totalPages = Math.ceil(this.pageData.tolalElementsOfData / this.pageData.size);
    this.pages = [];
    if (this.pageData.totalPages >= 7) {
      maxCount = 7;
       // 起始页为当前页-3.比如当前页为10，则应该由7页开始
      begin = this.pageData.currentPage - 3;
      if (begin < 1) {
        // 判断是否越界，可以删除下一行代码查看错误的效果
        begin = 1;
      } else if (begin > this.pageData.totalPages - 7) {
        // 判断是否越界，可以删除下一行代码查看错误的效果

        begin = this.pageData.totalPages - 7 + 1;
      };
    } else {
      maxCount = this.pageData.totalPages;
      begin = 1;
    }
    for (let i = 1; i <=  maxCount; begin++, i++) {
      this.pages.push(begin);
    }
    this.pageData.first = this.pageData.currentPage === 1;
    this.pageData.last = this.pageData.currentPage === this.pageData.totalPages;
  }

  onPage(currentPage: number) {
    Notiflix.Loading.standard('正在加载页面，请稍候...');
    this.pageData.currentPage = currentPage;
    this.loadByPage(currentPage);
  }

  frontPage() {
    Notiflix.Loading.standard('正在加载前一页，请稍候...');
    this.pageData.currentPage = this.pageData.currentPage - 1;
    this.loadByPage(this.pageData.currentPage);
  }

  nextPage() {
    Notiflix.Loading.standard('正在加载下一页，请稍候...');
    this.pageData.currentPage = this.pageData.currentPage + 1;
    this.loadByPage(this.pageData.currentPage);
  }

  loadByPage(currentPage : number) {
    this.courseData.currentPage =this.pageData.currentPage;
    this.courseService.searchCourses(this.courseData)
    .subscribe((data) => {
     this.courses= data.courses;
     this.definePageData(data.tolalElementsOfData);
     Notiflix.Loading.remove();
    })
  }

  changeToNUmber(data: any) {
    return Number(data);
  }
}
