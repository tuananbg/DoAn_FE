import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DepartmentService} from "../../../../service/department.service";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from 'moment';
import {PositionService} from "../../../../service/position.service";
import {PositionManagermentFormComponent} from "../position-managerment-form/position-managerment-form.component";
import {FileManagerService} from "../../../../service/file-manager.service";
import {SeatService} from "../../../../service/seat.service";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-position-managerment',
  templateUrl: './position-managerment.component.html',
  styleUrls: ['./position-managerment.component.less']
})
export class PositionManagermentComponent implements OnInit {

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
    sort: 'modifiedDate/desc', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  statusList = ['ACTIVE', 'INACTIVE'];
  currentTabIndex: number = 0;
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  department: any;
  departmentCode: any;
  isLoading = false;
  message: string = '';
  positionCode: any;


  constructor(
    private formBuilder: FormBuilder,
    private positionService: PositionService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private fileManagerService: FileManagerService,
    private seatService: SeatService,
  ) {

  }

  ngOnInit(): void {
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

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage: number = 0, pageSize: number = 10): void {
    const formValue = this.searchForm.value;
    const status = this.statusList[this.currentTabIndex]; // status = 'ACTIVE' | 'INACTIVE' | 'ALL'

    const queryModel = {
      keyword: formValue.keyword?.trim() || null
    };

    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort
    };

    const finalParams = { ...pageable, ...queryModel };

    this.spinner.show().then();
    this.positionService.getList(status, finalParams).subscribe(
      (res) => {
        if (res && res.code === "OK") {
          this.lstData = res.data.content || [];
          this.total = res.data.totalElements || 0;

          // Nếu trang hiện tại không có dữ liệu thì quay lại trang trước
          if (this.lstData.length === 0 && this.request.currentPage > 0) {
            this.request.currentPage--;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        } else {
          this.toastService.openErrorToast(res?.message || 'Lỗi không xác định');
        }
        this.spinner.hide();
      },
      (error) => {
        this.toastService.openErrorToast(error?.error?.message || 'Có lỗi xảy ra');
        this.spinner.hide();
      }
    );
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
      nzTitle: 'Thêm mới chức vụ',
      nzContent: PositionManagermentFormComponent,
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
      nzTitle: 'Cập nhật chức vụ',
      nzContent: PositionManagermentFormComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        idPositionForm : data.id,
        codeForm: data.positionCode,
        nameForm: data.positionName,
        descriptionForm: data.positionDescription,
        departmentIdForm: data.departmentId,
        isActive: data.isActive,
        departmentCodeForm: data.departmentCode,
        positionCategoryForm: data.positionCategoryCode,
        jobGroupForm: data.jobGroupCode
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
    this.positionCode = data.positionCode;

    const isActiveTab = this.currentTabIndex === 0;
    this.modalTitle = isActiveTab ? 'Xác nhận vô hiệu chức vụ' : 'Xác nhận mở khóa chức vụ';
    this.message = isActiveTab
      ? `Bạn có chắc chắn muốn vô hiệu mã chức vụ ${this.positionCode} này không?`
      : `Bạn có chắc chắn muốn mở khóa mã chức vụ ${this.positionCode} này không?`;

    this.isVisibleModalDelete = true;
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete(): void {

    const isActiveTab = this.currentTabIndex === 0;
    const call$ = isActiveTab
      ? this.positionService.lock(this.positionCode)
      : this.positionService.unlock(this.positionCode);

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
        this.spinner.hide().then();
      },
      error: (err) => {
        this.toastService.openErrorToast(err?.error?.msgCode || 'Lỗi hệ thống');
        this.isVisibleModalDelete = false;
        this.spinner.hide().then();
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

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

  async onExporting(e: any) {
    const status = this.statusList[this.currentTabIndex];
    this.positionService.exportPosition(status).subscribe({
      next: async (response) => {
        try {
          await this.fileManagerService.downloadBlobResponse(response, 'bang_thong_ke_cham_cong.xlsx');
        } catch (err: any) {
          this.toastService.openErrorToast(err.msgCode || 'Không có dữ liệu phù hợp để tải xuống.');
          this.spinner.hide().then();
        }
      },
      error: (error) => {
        this.toastService.openErrorToast(error?.msgCode || 'Không có dữ liệu phù hợp để tải xuống.');
        this.spinner.hide().then();
      },
      complete: () => {
        this.spinner.hide().then();
      }
    });
    e.cancel = true;
  }
}
