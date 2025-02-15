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
    sort: 'created_date,desc', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  lstStatus = [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"}
  ]
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  department: any;
  departmentCode: any;
  isLoading = false;
  message: string = '';
  idPosition: any;


  constructor(
    private formBuilder: FormBuilder,
    private positionService: PositionService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private fileManagerService: FileManagerService,
  ) {

  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      positionCode: new FormControl(null, [Validators.maxLength(100)]),
      positionName: new FormControl(null, [Validators.maxLength(100)]),
      isActive: new FormControl(null),
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number){
    const formValue = this.searchForm.value;
    const queryModel = {
      positionCode: !formValue.positionCode ? null : formValue.positionCode.toString(),
      positionName: !formValue.positionName ? null : formValue.positionName.toString(),
      isActive: formValue.isActive === 0 ? '0' : !formValue.isActive ? null : formValue.isActive.toString(),
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.positionService.searchPosition(queryModel, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.data;
        this.total = res.data.dataCount;
        this.spinner.hide().then();
        if (this.lstData.length === 0) {
          if (this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        }
        this.spinner.hide().then();
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
      this.spinner.hide().then();
    }, () => {
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
      this.idPosition = item.id;
      this.message = `<span>Bạn có chắc chắn muốn xóa chức vụ mã <b>${this.idPosition}</b> không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.positionService.deletePosition(this.idPosition).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa chức vụ thành công');
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


}
