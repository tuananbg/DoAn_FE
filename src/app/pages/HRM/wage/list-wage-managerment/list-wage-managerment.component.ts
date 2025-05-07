import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {WageService} from "../../../../service/wage.service";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {FormWageManagermentComponent} from "../form-wage-managerment/form-wage-managerment.component";

@Component({
  selector: 'app-list-wage-managerment',
  templateUrl: './list-wage-managerment.component.html',
  styleUrls: ['./list-wage-managerment.component.less']
})
export class ListWageManagermentComponent implements OnInit {

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
    pageSize: 10,
    sort: 'createdDate/desc', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  department: any;
  departmentCode: any;
  isLoading = false;
  message: string = '';
  allowanceCode: any;
  currentTabIndex = 0;
  statusList = ['ACTIVE', 'INACTIVE'];


  constructor(
    private formBuilder: FormBuilder,
    private wageService: WageService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private fileManagerService: FileManagerService,
    private i18n: NzI18nService,
  ) {

  }

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.searchForm = this.formBuilder.group({
      wageName: new FormControl(null, [Validators.maxLength(100)]),
      createdDate: new FormControl(null)
    });

    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }

    this.searchForm.get('wageName')?.valueChanges
      .pipe(
        debounceTime(500),               // đợi 500ms sau khi người dùng dừng gõ
        distinctUntilChanged()           // chỉ gọi nếu giá trị thực sự thay đổi
      )
      .subscribe(value => {
        this.onSearchChanged(value);
      });

    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number , pageSize?: number): void {
    const formValue = this.searchForm.value;
    const status = this.statusList[this.currentTabIndex];
    const params: any = {
      page: currentPage,
      size: pageSize,
      sort: ['createdDate/DESC']
    };
    if (formValue.wageName) {
      params.wageName = formValue.wageName.toString();
    }
    if (formValue.createdDate) {
      params.createdDate = formValue.createdDate;
    }

    this.spinner.show().then();
    this.wageService.getList(this.searchKeyword,status, params).subscribe(res => {
      if (res && res.code === 'OK') {
        this.lstData = res.data.content || [];
        this.total = res.data.totalElements || 0;

        if (this.lstData.length === 0 && this.request.currentPage !== 0) {
          this.request.currentPage--;
          this.fetchData(this.request.currentPage, this.request.pageSize);
        }
      } else {
        this.toastService.openErrorToast(res.body?.msgCode || 'Không lấy được dữ liệu');
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast(error.error?.msgCode || 'Lỗi hệ thống');
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
      isActive: null,
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới thông tin phụ cấp',
      nzContent: FormWageManagermentComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if(this.isLoading){
        this.nzOnSearch();
      }
    });
  }

  openUpdateModal(data?: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cập nhật hợp đồng',
      nzContent: FormWageManagermentComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        idWageForm : data.wageId,
        allowanceCodeForm : data.allowanceCode,
        allowanceNameForm : data.allowanceName,
        allowanceBaseForm : data.allowanceBase,
        allowanceDescriptionForm : data.allowanceDescription,
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if(this.isLoading){
        this.nzOnSearch();
      }
    });
  }

  openModalDelete(data: any): void {
    this.allowanceCode = data.allowanceCode;

    const isActiveTab = this.currentTabIndex === 0;
    this.modalTitle = isActiveTab ? 'Xác nhận vô hiệu phụ cấp' : 'Xác nhận mở khóa phụ cấp';
    this.message = isActiveTab
      ? `Bạn có chắc chắn muốn vô hiệu phụ cấp mã ${this.allowanceCode} này không?`
      : `Bạn có chắc chắn muốn mở khóa phụ cấp mã ${this.allowanceCode} này không?`;

    this.isVisibleModalDelete = true;
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete(): void {
    const isActiveTab = this.currentTabIndex === 0;
    const call$ = isActiveTab
      ? this.wageService.lockAllowance(this.allowanceCode)
      : this.wageService.unlockAllowance(this.allowanceCode);

    this.spinner.show().then();

    call$.subscribe({
      next: (res) => {
        if (res.code === '202') {
          this.toastService.openSuccessToast('Cập nhật trạng thái phụ cấp thành công');
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


  changeCurrentPage(currentPage: number) {
    this.request.currentPage = currentPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.pageSize = itemPerPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  handleClick(attachFile: string) {
    console.log('Attach file:', attachFile);
    this.wageService.downLoadFile(attachFile).subscribe(res => {
      const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/octet-stream';
      const responseData = isJsonBlob(res.body) ? (res.body).text() : res.body || {};
      if (typeof responseData === "string") {
        const responseJson = JSON.parse(responseData);
        this.toastService.openErrorToast(responseJson.msgCode);
      } else {
        this.fileManagerService.downloadFile(res, 'phu_cap_' + attachFile);
      }
    }, error => {
      this.toastService.openErrorToast(error);
    }, () => {
      this.spinner.hide().then();
    });
  }

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

}
