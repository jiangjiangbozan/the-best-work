import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

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
  }

  onChangePage(page: number): void {
    this.pageChanged.emit({ page: page, pageSize: this.pageSize });
    this.updateQueryParams();
    this.fetch.emit(); // 直接在这里调用 fetchSchools
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.pageChanged.emit({ page: this.currentPage, pageSize: size });
    // 使用 Router 进行编程式导航到第一页
    this.updateQueryParams();
    this.fetch.emit();
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.router.routerState.root,
      queryParams: { page: this.currentPage, size: this.pageSize },
      queryParamsHandling: 'merge', // Merge new params with existing ones
    });
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
