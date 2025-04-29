import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {AccountService} from "../../../service/account.service";
import {AccountSearchResponse, AccountSearchRequest} from "./types/account";
import {
  PositionManagermentFormComponent
} from "../../HRM/position/position-managerment-form/position-managerment-form.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../service/toast.service";
import {FormAccountManagementComponent} from "../form-account-management/form-account-management.component";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.less']
})
export class AccountManagementComponent implements OnInit {
  searchActive: boolean = true
  isLoading = false;

  resultActive: boolean = true
  tableLoading: boolean = false
  searchForm!: FormGroup;
  request: any = {
    currentPage: 0,
    pageSize: 10,
    sort: ['createdDate/DESC']
  };
  searchFormValue: any;
  currentTabIndex = 0;
  statusList = ['ACTIVE', 'LOCK'];
  tableData: Array<AccountSearchResponse> = []
  searchData: object = {}
  columns = [
    // {
    //   title: 'Tên nhân viên',
    //   width: '200px',
    //   compare: (a: any, b: any) => a.fullName - b.fullName,
    // },
    {
      title: 'Email',
      width: '200px',
      compare: (a: any, b: any) => a.email - b.email,
    },
    {
      title: 'Trạng thái',
      width: '140px',
      compare: (a: any, b: any) => a.status - b.status,
    },
    {
      title: 'Trạng thái kích hoạt',
      width: '170px',
      compare: (a: any, b: any) => a.active - b.active,
    },
    {
      title: 'Quyền',
      width: '140px',
      compare: (a: any, b: any) => a.roles - b.roles,
    },
    {
      title: 'Ngày tạo',
      width: '140px',
      compare: (a: any, b: any) => a.createdAt - b.createdAt,
    },
  ];


  constructor(private accountService: AccountService,
              private modal: NzModalService,
              private spinner: NgxSpinnerService,
              private viewContainerRef: ViewContainerRef,
              private toastService: ToastService,
              private i18n: NzI18nService,
              private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.searchForm = this.formBuilder.group({
      keyword: new FormControl(null, [Validators.maxLength(100)]),
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }

    this.searchForm.get('keyword')?.valueChanges
      .pipe(
        debounceTime(500),               // đợi 500ms sau khi người dùng dừng gõ
        distinctUntilChanged()           // chỉ gọi nếu giá trị thực sự thay đổi
      )
      .subscribe(value => {
        this.onSearchChanged(value);
      });

    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const formValue = this.searchForm.value;
    const status = this.statusList[this.currentTabIndex];

    const queryModel = {
      keyword: formValue.keyword ?? "",
    };

    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort
    };

    const finalParams = { ...pageable, ...queryModel };

    this.spinner.show().then();
    this.accountService.getAllAccount(status, finalParams)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res && res.dataList) {
            this.tableData = res.dataList;
          }
          this.spinner.hide().then(); // Ẩn spinner sau khi tải xong
        },
        error: (err) => {
          if (err.error && err.error.msgCode) {
            this.toastService.openErrorToast(err.error.msgCode);
          }
          this.spinner.hide().then(); // Ẩn spinner khi có lỗi
        },
        complete: () => {
          console.log("Hoàn thành tải dữ liệu tài khoản.");
        }
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

  // handlePageIndexChange($event: number) {
  //   this.pagination.current = $event - 1
  //   this.getData()
  // }
  //
  // handlePageSizeChange($event: number) {
  //   this.pagination.pageSize = $event
  //   this.getData()
  // }

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
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
        rolesForm: data.roles,
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if (this.isLoading) {
        this.fetchData(this.request.currentPage, this.request.pageSize);
      }
    });
  }


}
