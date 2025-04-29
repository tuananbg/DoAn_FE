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

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.positionCode = item.positionCode;
      this.message = `<span>Bạn có chắc chắn muốn vô hiệu chức vụ <b>${this.positionCode}</b> không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    console.log("code",this.positionCode)
    this.positionService.disable(this.positionCode).subscribe(res => {
      if (res && res.code === "202") {
        const data = res.data;
        this.toastService.openSuccessToast('Vô hiệu chức vụ thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
      this.fetchData(this.request.currentPage, this.request.pageSize);
    });
  }

  openExport() {
    for (const control in this.searchForm.controls) {
      if (this.searchForm.contains(control)) {
        this.searchForm.controls[control].markAsDirty();
        this.searchForm.controls[control].updateValueAndValidity();
      }
    }
    if (this.searchForm.invalid) return;
    const formValue = this.searchForm.value;

    const queryModel = {
      positionCode: !formValue.positionCode ? null : formValue.positionCode.trim().toString(),
      positionName: !formValue.positionName ? null : formValue.positionName.toString(),
      isActive: formValue.isActive === 0 ? '0' : !formValue.isActive ? null : formValue.isActive.toString(),
    };
    const pageable = {
      sort: this.request.sort
    };
    this.spinner.show().then();
    this.positionService.exportPosition(queryModel, pageable).subscribe(async response => {
      const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
      const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
      if (typeof responseData === "string") {
        const responseJson = JSON.parse(responseData);
        this.toastService.openErrorToast(responseJson.msgCode);
      } else {
        const currentDate = moment();
        const formattedDate = currentDate.format('DD-MM-YYYY');
        this.fileManagerService.downloadFile(response, 'danhsachchucvu_'+formattedDate+'.xlsx');
      }
    }, error => {
      this.toastService.openErrorToast(error);
    }, () => {
      this.spinner.hide().then();
    });
    this.nzOnSearch();
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

}
