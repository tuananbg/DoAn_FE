import {DepartmentService} from '../../../../service/department.service';
import {Component, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastService} from 'src/app/service/toast.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {CreateDepartmentComponent} from "../create-department/create-department.component";
import {NzTableSortOrder} from "ng-zorro-antd/table";
import {LoginService} from "../../../../service/login.service";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {FileManagerService} from "../../../../service/file-manager.service";

@Component({
  selector: 'app-department-managerment',
  templateUrl: './department-managerment.component.html',
  styleUrls: ['./department-managerment.component.less']
})
export class DepartmentManagermentComponent implements OnInit {
  isActive = true;
  searchForm!: FormGroup;
  searchFormValue: any;
  modalTitle = '';
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 25,
    sort: 'modifiedDate/DESC', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  lstStatus = [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"}
  ]
  currentTabIndex = 0;
  statusList = ['ACTIVE', 'INACTIVE'];
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  department: any;
  departmentCode: any;
  isLoading = false;
  status: any;
  message: string = '';
  idDepartment: any;


  constructor(
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private fileManagerService: FileManagerService,
  ) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      departmentCode: new FormControl(null, [Validators.maxLength(100)]),
      status: new FormControl(null),
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }
    this.searchForm.get('departmentCode')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.onSearchChanged(value);
      });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const status = this.statusList[this.currentTabIndex];
    const formValue = this.searchForm.value;

    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };

    const keyword = formValue.departmentCode?.toString() || null;

    this.spinner.show().then();
    this.departmentService.getList(keyword, status, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.content;
        this.total = res.data.totalElements;

        if (this.lstData.length === 0 && this.request.currentPage !== 0) {
          this.request.currentPage = this.request.currentPage - 1;
          this.fetchData(this.request.currentPage, this.request.pageSize);
        }
      } else {
        this.toastService.openErrorToast("Lỗi hệ thống");
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast("Lỗi hệ thống");
      this.spinner.hide().then();
    });
  }


  nzOnSearch(): void {
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  resetForm() {
    this.searchForm.reset();
    this.searchForm.patchValue({
      name: null,
      status: null,
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới phòng ban',
      nzContent: CreateDepartmentComponent,
      nzWidth: '500px',
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if (this.isLoading) {
        this.nzOnSearch();
      }
    });
  }

  openUpdateModal(data?: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cập nhật phòng ban',
      nzContent: CreateDepartmentComponent,
      nzWidth: '500px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        idDepartment: data.departmentId,
        isUpdate: true,
        codeForm: data.departmentCode,
        nameForm: data.departmentName,
        status: data.status,
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if (this.isLoading) {
        this.nzOnSearch();
      }
    });
  }

  openModalDelete(data: any): void {
    this.departmentCode = data.departmentCode;

    const isActiveTab = this.currentTabIndex === 0;
    this.modalTitle = isActiveTab ? 'Xác nhận vô hiệu phòng ban' : 'Xác nhận mở khóa phòng ban';
    this.message = isActiveTab
      ? `Bạn có chắc chắn muốn vô hiệu mã phòng ban ${this.departmentCode} này không?`
      : `Bạn có chắc chắn muốn mở khóa mã phòng ban ${this.departmentCode} này không?`;

    this.isVisibleModalDelete = true;
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete(): void {
    const isActiveTab = this.currentTabIndex === 0;
    const call$ = isActiveTab
      ? this.departmentService.lock(this.departmentCode)
      : this.departmentService.unlock(this.departmentCode);

    this.spinner.show().then();

    call$.subscribe({
      next: (res) => {
        if (res.code === '202') {
          this.toastService.openSuccessToast('Cập nhật trạng thái phòng ban thành công');
          this.fetchData(this.request.currentPage, this.request.pageSize);
        } else {
          this.toastService.openErrorToast(res?.message || 'Thất bại');
        }
        this.isVisibleModalDelete = false;
      },
      error: (err) => {
        this.toastService.openErrorToast(err?.error?.msgCode || 'Lỗi hệ thống');
        this.isVisibleModalDelete = false;
      },
      complete: () => {
        this.spinner.hide().then();
      }
    });
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  changeCurrentPage(currentPage: number) {
    this.request.currentPage = currentPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.pageSize = itemPerPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  searchKeyword: string | null = null;

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }


}
