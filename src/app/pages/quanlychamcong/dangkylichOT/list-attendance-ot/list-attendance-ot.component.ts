import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import * as moment from "moment";
import {EmployeeService} from "../../../../service/employee.service";
import {AttendanceOTService} from "../../../../service/attendance-ot.service";

@Component({
  selector: 'app-list-attendance-ot',
  templateUrl: './list-attendance-ot.component.html',
  styleUrls: ['./list-attendance-ot.component.less']
})
export class ListAttendanceOtComponent implements OnInit {

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
  lstIsActive = [
    {id: 1, name: "Đã duyệt"},
    {id: 2, name: "Chờ duyệt"},
    {id: 3, name: "Từ chối"}
  ]
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  isLoading = false;
  message: string = '';
  idAttendanceOT: any;
  isVisible: any;
  isUpdate = false;
  idChild: any;
  objectChild = {
    startDay: null,
    startTime: null,
    endTime: null,
    totalTime: null,
    followId: null,
    descriptionOt: null
  };
  lstEmployee: any[] = [];
  payloadEmployee = {
    employeeCode: null,
    employeeName: null,
    employeeEmail: null,
    employeeGender: null,
    positionId: null,
    departmentId: null
  };
  idUserDetailId: any;

  constructor(
    private formBuilder: FormBuilder,
    private attendanceOTService: AttendanceOTService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private fileManagerService: FileManagerService,
    private i18n: NzI18nService,
    private employeeService: EmployeeService
  ) {

  }

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.idUserDetailId = userObject.userDetailId;
    this.searchForm = this.formBuilder.group({
      startDay: new FormControl(null),
      employeeId: new FormControl(null),
      isActive: new FormControl(null),
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }
    this.fetchData(this.request.currentPage, this.request.pageSize);
    this.fetchEmployee();
  }

  parseJwt(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  fetchData(currentPage?: number, pageSize?: number){
    const formValue = this.searchForm.value;
    const queryModel = {
      isActive: formValue.isActive === 0 ? '0' : !formValue.isActive ? null : formValue.isActive.toString(),
      startDay: !formValue.startDay ? null : formValue.startDay,
      employeeId: !formValue.employeeId ? null : formValue.employeeId,
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.attendanceOTService.searchAttendanceOt(queryModel, pageable).subscribe(res => {
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
      isActive: null,
      startDay: null,
      employeeId: null,
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    this.idChild = null;
    this.isVisible = true;
  }

  openUpdateModal(data?: any): void {
    this.idChild = data.attendanceOtID;
    this.objectChild = {
      startDay: data.startDay,
      startTime: data.startTime,
      endTime: data.endTime,
      totalTime: data.totalTime,
      followId: data.followId,
      descriptionOt: data.descriptionOt
    };
    this.isVisible = true;
    this.isUpdate = true;
  }

  openUpdateActiveModal(data?: any){
    const dataModel = {attendanceOtID : data.attendanceOtID, isActive: 1};
    this.attendanceOTService.editAttendanceOt(dataModel).subscribe(res => {
      if (res && res.code === "OK") {
        this.toastService.openSuccessToast('Đã được duyệt');
        this.fetchData(this.request.currentPage, this.request.pageSize);
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
    }, () => {
      this.spinner.hide().then();
    });
  }

  openUpdateActiveFalseModal(data?: any){
    const dataModel = {attendanceOtID : data.attendanceOtID, isActive: 3};
    this.attendanceOTService.editAttendanceOt(dataModel).subscribe(res => {
      if (res && res.code === "OK") {
        this.toastService.openInfoToast('Đơn đã bị từ chối');
        this.fetchData(this.request.currentPage, this.request.pageSize);
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
    }, () => {
      this.spinner.hide().then();
    });
  }

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.idAttendanceOT = item.attendanceOtID;
      this.message = `<span>Bạn có chắc chắn muốn xóa đơn tăng ca này không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.attendanceOTService.deleteAttendanceOt(this.idAttendanceOT).subscribe(res => {
      if (res && res.code === "OK") {
        this.toastService.openSuccessToast('Xóa đơn tăng ca thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
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
      isActive: formValue.isActive === 0 ? '0' : !formValue.isActive ? null : formValue.isActive.toString(),
      startDay: !formValue.startDay ? null : formValue.startDay,
      employeeId: !formValue.employeeId ? null : formValue.employeeId,
    };
    const pageable = {
      sort: this.request.sort
    };
    this.spinner.show().then();
    this.attendanceOTService.exportAttendanceOt(queryModel, pageable).subscribe(async response => {
      const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
      const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
      if (typeof responseData === "string") {
        const responseJson = JSON.parse(responseData);
        this.toastService.openErrorToast(responseJson.msgCode);
      } else {
        const currentDate = moment();
        const formattedDate = currentDate.format('DD-MM-YYYY');
        this.fileManagerService.downloadFile(response, 'danhsachdontangca_'+formattedDate+'.xlsx');
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

  handleCancelModal(): void {
    this.isVisible = false;
    this.isUpdate = false;
  }
  handleOkModal(){
    this.isVisible = false;
    this.isUpdate = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchEmployee() {
    this.employeeService.searchEmployee(this.payloadEmployee, {page: 0, size: -1}).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstEmployee = res.data.data;
        this.lstEmployee = this.lstEmployee.map(item => ({
          ...item,
          employeeName: item.employeeName + " - " + item.employeeCode
        }));
        this.lstEmployee.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
      }
    }, (error: any) => {
      console.log(error);
    })
  }


}
