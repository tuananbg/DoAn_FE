import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AccountService } from "../../../service/account.service";
import { AccountSearchResponse, Role } from "./types/account";
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../../../service/toast.service";
import { FormAccountManagementComponent } from "../form-account-management/form-account-management.component";
import { en_US, NzI18nService } from "ng-zorro-antd/i18n";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.less']
})
export class AccountManagementComponent implements OnInit {
  searchActive: boolean = true;
  resultActive: boolean = true;
  isLoading = false;
  tableLoading = false;
  currentTabIndex = 0;
  currentDeleteEmployeeCode: string | null = null;
  modalTitle = '';


  request: any = {
    currentPage: 0,
    pageSize: 25,
    sort: ['modifiedDate/DESC']
  };
  isVisibleModalDelete = false;
  message: string = '';

  statusList = ['ACTIVE', 'LOCK'];
  searchKeyword: string | null = null;
  tableData: AccountSearchResponse[] = [];
  searchForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private toastService: ToastService,
    private i18n: NzI18nService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.searchForm = this.formBuilder.group({
      keyword: new FormControl(null, [Validators.maxLength(100)]),
    });

    this.searchForm.get('keyword')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(value => this.onSearchChanged(value));

    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const formValue = this.searchForm.value;
    const status = this.statusList[this.currentTabIndex];

    const finalParams = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
      keyword: formValue.keyword ?? ""
    };

    this.spinner.show().then();
    this.accountService.getAllAccount(status, finalParams).subscribe({
      next: (res) => {
        if (res && res.data && res.data.content) {
          this.tableData = res.data.content;
        }
        this.spinner.hide().then();
      },
      error: (err) => {
        if (err.error && err.error.msgCode) {
          this.toastService.openErrorToast(err.error.msgCode);
        }
        this.spinner.hide().then();
      },
      complete: () => console.log("Hoàn thành tải dữ liệu tài khoản.")
    });
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  nzOnSearch(): void {
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  onSearchChanged(event: any) {
    this.searchKeyword = event ? event : null;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  openUpdateModal(data?: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cập nhật tài khoản',
      nzContent: FormAccountManagementComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        emailForm: data.email,
        rolesForm: data.role,
        employeeCodeForm: data.employeeCode,
        fullNameForm: data.fullName
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });

    modalRef.afterClose.subscribe(() => {
      this.isLoading = true;
      if (this.isLoading) {
        this.fetchData(this.request.currentPage, this.request.pageSize);
      }
    });
  }

  getRoleNames(roles: any[]): string {
    if (!roles || !Array.isArray(roles)) return '';
    return roles.map(r => r.name).join(', ');
  }

  openModalDelete(data: any): void {
    this.currentDeleteEmployeeCode = data.employeeCode;

    const isActiveTab = this.currentTabIndex === 0;
    this.modalTitle = isActiveTab ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản';
    this.message = isActiveTab
      ? 'Bạn có chắc chắn muốn khóa tài khoản này không?'
      : 'Bạn có chắc chắn muốn mở khóa tài khoản này không?';

    this.isVisibleModalDelete = true;
  }

  onCancelModalDelete(): void {
    this.isVisibleModalDelete = false;
    this.currentDeleteEmployeeCode = null;
  }
  callBackModalDelete(): void {
    if (!this.currentDeleteEmployeeCode) return;

    const isActiveTab = this.currentTabIndex === 0;
    const call$ = isActiveTab
      ? this.accountService.lock(this.currentDeleteEmployeeCode)
      : this.accountService.unlock(this.currentDeleteEmployeeCode);

    this.spinner.show().then();

    call$.subscribe({
      next: (res) => {
        if (res.code === '202') {
          this.toastService.openSuccessToast('Cập nhật trạng thái tài khoản thành công');
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


}
