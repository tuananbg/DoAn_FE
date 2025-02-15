import { DepartmentService } from '../../../../service/department.service';
import {Component, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/service/toast.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {CreateDepartmentComponent} from "../create-department/create-department.component";
import {NzTableSortOrder} from "ng-zorro-antd/table";
import {LoginService} from "../../../../service/login.service";

@Component({
  selector: 'app-department-managerment',
  templateUrl: './department-managerment.component.html',
  styleUrls: ['./department-managerment.component.less']
})
export class DepartmentManagermentComponent implements OnInit {
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
    sort: 'created_Date,DESC', // -: desc | +: asc,
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
  status: any;
  message: string = '';
  idDepartment: any;


  constructor(
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private login: LoginService
  ) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.maxLength(100)]),
      status: new FormControl(null),
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number){
    const formValue = this.searchForm.value;
    const queryModel = {
      name: !formValue.name ? null : formValue.name.toString(),
      status: formValue.status === 0 ? '0' : !formValue.status ? null : formValue.status.toString(),
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.departmentService.searchDepartment(queryModel, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.content;
        this.total = res.data.totalElements;
        this.spinner.hide().then();
        if (this.lstData.length === 0) {
          if (this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        }
        this.spinner.hide().then();
      } else {
        this.toastService.openErrorToast("Lỗi hệ thống");
      }
      this.spinner.hide().then();
    }, error => {
      // this.toastService.openErrorToast(error.error.msgCode);
      this.toastService.openErrorToast("Lỗi hệ thống");
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
      if(this.isLoading){
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
        idDepartment : data.departmentId,
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
      if(this.isLoading){
        this.nzOnSearch();
      }
    });
  }

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.departmentCode = item.departmentCode;
      this.department = item;
      this.idDepartment = item.departmentId;
      this.message = `<span>Bạn có chắc chắn muốn xóa phòng ban mã <b>${this.departmentCode}</b> không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.departmentService.deleteDepartment(this.idDepartment).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa phòng ban thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
      this.fetchData(this.request.currentPage, this.request.pageSize);
    });
  }

  openExport() {
    // for (const control in this.searchForm.controls) {
    //   if (this.searchForm.contains(control)) {
    //     this.searchForm.controls[control].markAsDirty();
    //     this.searchForm.controls[control].updateValueAndValidity();
    //   }
    // }
    // if (this.searchForm.invalid) return;
    // const formValue = this.searchForm.value;

    // const queryModel = {
    //   code: !formValue.code ? null : formValue.code.trim().toString(),
    //   systemCode: !formValue.systemCode ? null : formValue.systemCode.toString(),
    //   status: formValue.status === 0 ? '0' : !formValue.status ? null : formValue.status.toString(),
    //   levelWarning: !formValue.levelWarning ? null : formValue.levelWarning.toString(),
    //   staffId: !formValue.staffId ? null : formValue.staffId,
    // };
    // this.spinner.show().then();
    // this.ticketAlertService.exportTicket(queryModel).subscribe(async response => {
    //     const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
    //     const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
    //     if (typeof responseData === "string") {
    //       const responseJson = JSON.parse(responseData);
    //       this.toastService.openErrorToast(responseJson.msgCode);
    //     } else {
    //       const currentDate = moment();
    //       const formattedDate = currentDate.format(DATE_EXCEL);
    //       this.fileManagerService.downloadFile(response, 'danhsachticket_'+formattedDate+'.xlsx');
    //     }
    //   }, error => {
    //     this.toastService.openErrorToast(error);
    //   }, () => {
    //     this.spinner.hide().then();
    //   });
    // this.nzOnSearch();
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
