import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.less']
})
export class PagingComponent implements OnInit, OnChanges {

  // Đầu vào
  @Input() itemOfPage = 10;       // Số lượng item trên 1 trang
  @Input() totalItems = 100;      // Tổng số items
  // @Input() activePage = 0;
  @Input() currentPage = 0;
  // Đầu ra
  @Output() changeItemPerPage: EventEmitter<number> = new EventEmitter<number>();
  @Output() changeCurrentPage: EventEmitter<number> = new EventEmitter<number>();      // Gửi currentPage lên cho parent component

  // Khởi tạo danh sách item/ trang
  listItemOfPage = [
    {label: '10', value: 10},
    {label: '20', value: 20},
    {label: '50', value: 50},
    {label: '100', value: 100}
  ];

  currentItemPerPage = this.listItemOfPage[0].value;
  totalPages: number = this.totalItems ? Math.ceil(this.totalItems / this.itemOfPage) : 0;
  currItemPerPage = 0; // Số lượng item hiện tại của trang

  // Khởi tạo mảng pages từ totalPages
  pages = Array.from(Array(this.totalPages).keys()).map(
    item => {
      return {isActive: false, value: item}
    }
  )

  size: any = "md";

  // Khởi tạo formGroup
  formGroup = new FormGroup({
    itemPage: new FormControl(this.itemOfPage),
    goPage: new FormControl(this.currentPage + 1)
  })

  TOOLTIP = {
    PLACEMENT_TOP: 'top'
  };
  

  constructor() {
  }

  ngOnInit(): void {
    this.currentItemOnPage();
    // set page 1 isActive
    if (this.pages.length) this.pages[this.currentPage].isActive = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.currentPage = 0;
    if (this.totalItems && changes['totalItems']) this.totalItems = changes['totalItems'].currentValue ? changes['totalItems'].currentValue : 0;
    // Lấy thông tin số lượng item mỗi trang => set item mỗi trang
    const index = this.listItemOfPage.findIndex(item => item.value === this.itemOfPage);
    this.currentItemPerPage = this.listItemOfPage[index].value;
    this.totalPages = Math.ceil(this.totalItems / this.itemOfPage);
    // khởi tạo page
    this.pages = Array.from(Array(this.totalPages).keys()).map(
      item => {
        return {isActive: false, value: item}
      }
    )
    if (this.pages.length) this.pages[this.currentPage].isActive = true;
    this.currentItemOnPage();
  }

  /**
   * @param index
   * Chuyển đến trang theo index đầu vào
   */
  goPage(index: number) {
    this.pages = this.pages.map(page => {
      return {
        ...page,
        isActive: false
      };
    });
    this.pages[index].isActive = true;
    this.currentPage = index;

    this.changeCurrentPage.emit(this.currentPage);      // Gửi currentPage cho parent component
    this.currentItemOnPage();
  }

  onChangeItemPerPage(e: any) {
    this.totalPages = Math.ceil(this.totalItems / e);
    this.pages = Array.from(Array(this.totalPages).keys()).map(
      item => {
        return {isActive: false, value: item}
      }
    )
    if (this.pages.length) this.pages[0].isActive = true;
    this.currentPage = 0;
    this.currentItemOnPage();

    this.changeItemPerPage.emit(e);
    this.changeCurrentPage.emit(0);
  }

  currentItemOnPage() {
    if (this.totalItems < this.currentItemPerPage) {
      this.currItemPerPage = this.totalItems;
    } else {
      if (this.pages.length === (this.currentPage + 1)) {
        this.currItemPerPage = this.totalItems - this.currentItemPerPage * this.currentPage;
      } else {
        this.currItemPerPage = this.currentItemPerPage;
      }
    }
  }

}
