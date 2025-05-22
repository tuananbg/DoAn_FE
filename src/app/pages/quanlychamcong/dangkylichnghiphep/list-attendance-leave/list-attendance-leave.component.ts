import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import * as moment from "moment/moment";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {AttendanceLeaveService} from "../../../../service/attendance-leave.service";
import {EmployeeService} from "../../../../service/employee.service";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-list-attendance-leave',
  templateUrl: './list-attendance-leave.component.html',
  styleUrls: ['./list-attendance-leave.component.less']
})
export class ListAttendanceLeaveComponent implements OnInit {

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
  currentTabIndex = 0;
  statusList = ["TODO", 'DONE','REJECT'];
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
  isShowActionColumn = true;
  isVisibleModalDelete = false;
  isLoading = false;
  message: string = '';
  idAttendanceLeave: any;
  startDayErrorMessage = '';
  endDayErrorMessage = '';
  isVisible: any;
  isUpdate = false;
  idChild: any;
  listOfOption: string[] = [];
  objectChild = {
      leaveCategory: null,
      startDay: null,
      endDay: null,
      totalTime: null,
     reviewerCode: null,
      description: null
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
  isDisabled: any;
  employeeCode: any;
  constructor(
    private formBuilder: FormBuilder,
    private attendanceLeaveService: AttendanceLeaveService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private fileManagerService: FileManagerService,
    private i18n: NzI18nService,
    private employeeService: EmployeeService
  ) {

  }

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.employeeCode = localStorage.getItem('employeeCode');
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
    this.fetchEmployee();
  }

  // parseJwt(token: string): string {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
  //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join(''));
  //
  //   return JSON.parse(jsonPayload);
  // };

  fetchData(currentPage?: number, pageSize?: number){
    const pageable = { page: currentPage, size: pageSize };
    const status = this.statusList[this.currentTabIndex];
    this.spinner.show().then();
    this.attendanceLeaveService.searchAttendanceLeave(this.searchKeyword, status, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.content;
        this.total = res.data.totalElements;
        this.checkShowActionColumn();
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
      endDay: null,
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    this.idChild = null;
    this.isVisible = true;
    this.isUpdate = false; // ⬅️ THÊM DÒNG NÀY
    this.objectChild = {
      leaveCategory: null,
      startDay: null,
      endDay: null,
      totalTime: null,
      reviewerCode: null,
      description: null
    };
  }

  checkShowActionColumn(): void {
    this.isShowActionColumn = this.lstData?.some(item => item.status !== 2 && item.status !== 3);
  }

  openUpdateModal(data?: any): void {
    this.idChild = data.id;
    console.log("data",data)
    this.objectChild = {
        leaveCategory: data.leaveCategory,
        startDay: data.startDay,
        endDay: data.endDay,
        totalTime: data.totalTime,
        reviewerCode: data.reviewerCode,
        description: data.description
    };
    this.isVisible = true;
    this.isUpdate = true;
  }

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.idAttendanceLeave = item.leaveID;
      this.message = `<span>Bạn có chắc chắn muốn xóa đơn nghỉ phép này không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.attendanceLeaveService.deleteAttendanceLeave(this.idAttendanceLeave).subscribe(res => {
      if (res && res.code === "OK") {
        this.toastService.openSuccessToast('Xóa đơn nghỉ phép thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
      this.fetchData(this.request.currentPage, this.request.pageSize);
    });
  }

  async onExporting(e: any) {
    const status = this.statusList[this.currentTabIndex];
    this.attendanceLeaveService.exportAttendanceLeave(status).subscribe({
      next: async (response) => {
        try {
          await this.fileManagerService.downloadBlobResponse(response, 'bang_don_nghi_phep.xlsx');
        } catch (err: any) {
          this.toastService.openErrorToast(err.msgCode || 'Không có dữ liệu phù hợp để tải xuống.');
          this.spinner.hide().then();
        }
      },
      error: (error) => {
        this.toastService.openErrorToast(error?.msgCode || 'Lỗi kết nối máy chủ');
        this.spinner.hide().then();
      },
      complete: () => {
        this.spinner.hide().then();
      }
    });
    e.cancel = true;
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

  changeCurrentPage(currentPage: number) {
    this.request.currentPage = currentPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.pageSize = itemPerPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  onChangeStartDay(event: any) {
    if (event) {
      const startDay = new Date(event);
      this.startDayErrorMessage = '';
      if (this.searchForm.getRawValue().endDay) {
        const endDay = new Date(this.searchForm.getRawValue().endDay);
        if (startDay >= endDay) {
          this.searchForm.get('startDay')?.setErrors({
            'lessThanExpire': true
          });
          this.startDayErrorMessage = this.startDayErrorMessage + 'Ngày bắt đầu phải trước Ngày kết thúc';
          this.searchForm.get('startDay')?.markAsDirty();
          return;
        } else {
          this.searchForm.get('startDay')?.setErrors(null);
          this.searchForm.get('endDay')?.setErrors(null);
          this.startDayErrorMessage = '';
          this.endDayErrorMessage = '';
        }
      }
    } else {
      if (this.searchForm.get('startDay')?.touched) {
        this.searchForm.get('startDay')?.setErrors({
          'required': true
        });
        this.startDayErrorMessage = 'Ngày bắt đầu không được để trống';
        this.searchForm.get('startDay')?.markAsDirty();
      }
    }
  }

  onChangeEndDay(event: any) {
    if (event) {
      const endDay = new Date(event);
      if (event && this.searchForm.getRawValue().startDay) {
        const startDay = new Date(this.searchForm.getRawValue().startDay);
        if (endDay <= startDay) {
          this.searchForm.get('endDay')?.setErrors({
            'lessThanExpire': true
          });
          this.endDayErrorMessage = 'Ngày kết thúc phải sau Ngày bắt đầu';
          return;
        } else {
          this.onChangeStartDay(this.searchForm.getRawValue().startDay);
          this.searchForm.get('endDay')?.setErrors(null);
          this.endDayErrorMessage = '';
        }
      }
    } else {
      if (this.searchForm.get('endDay')?.touched) {
        this.searchForm.get('endDay')?.setErrors({
          'required': true
        });
        this.endDayErrorMessage = 'Ngày kết thúc không được để trống';
        this.searchForm.get('endDay')?.markAsDirty();
      }
    }
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

  approvedModal(data?: any){
    const dataModel = {id : data.id, status: 3};
    this.attendanceLeaveService.completeAttendanceLeave(dataModel).subscribe(res => {
      if (res && res.code === "202") {
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

  fetchEmployee() {
    this.employeeService.getListSelect().subscribe(res => {
      if (res && res.code === "OK") {
        this.lstEmployee = res.data;
        this.lstEmployee =  this.lstEmployee.map(res => `${res.employeeName} - ${res.employeeCode}`);
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

  rejectModal(data?: any){
    const dataModel = {id : data.id, status: 2};
    this.attendanceLeaveService.completeAttendanceLeave(dataModel).subscribe(res => {
      if (res && res.code === "202") {
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

}
