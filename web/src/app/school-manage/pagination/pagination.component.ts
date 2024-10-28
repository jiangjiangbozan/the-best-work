import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import * as Notiflix from "notiflix";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalPages: number = 1;
  @Output() pageChanged = new EventEmitter<{ page: number, pageSize: number }>();
  @Output() fetch = new EventEmitter<void>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    // 当totalPages小于1时，显示错误信息
    if (this.totalPages < 1) {
      Notiflix.Notify.failure('分页信息错误，无法显示页码。');
    }
  }

  onChangePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      Notiflix.Notify.warning('请选择一个有效的页码。');
      return;
    }
    this.currentPage = page;
    this.pageChanged.emit({ page: page, pageSize: this.pageSize });
    this.updateQueryParams();
    this.fetch.emit();
    Notiflix.Notify.success(`已切换到第 ${page} 页。`);
  }

  onPageSizeChange(size: number): void {
    if (size < 1) {
      Notiflix.Notify.warning('请选择一个有效的页面大小。');
      return;
    }
    this.pageSize = size;
    this.currentPage = 1;
    this.pageChanged.emit({ page: this.currentPage, pageSize: size });
    this.updateQueryParams();
    this.fetch.emit();
    Notiflix.Notify.success(`页面大小已更新为 ${size}。`);
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.router.routerState.root,
      queryParams: { page: this.currentPage, size: this.pageSize },
      queryParamsHandling: 'merge',
    });
  }

  getPageNumbersNearby(): number[] {
    const pages: number[] = [];
    const half = 5; // 显示当前页左右各5页
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, this.currentPage + half);

    // 如果当前页接近开头，将end页码调整到显示10个页码
    if (this.currentPage <= half) {
      end = Math.min(this.totalPages, 2 * half + 1);
    }

    // 如果当前页接近结尾，将start页码调整到显示10个页码
    if (this.currentPage >= this.totalPages - half) {
      start = Math.max(1, this.totalPages - 2 * half);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
