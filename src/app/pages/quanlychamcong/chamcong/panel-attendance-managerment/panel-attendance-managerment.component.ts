import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DepartmentService} from "../../../../service/department.service";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {LoginService} from "../../../../service/login.service";
import {CreateDepartmentComponent} from "../../../HRM/department/create-department/create-department.component";
import {AttendanceService} from "../../../../service/attendance.service";

@Component({
  selector: 'app-panel-attendance-managerment',
  templateUrl: './panel-attendance-managerment.component.html',
  styleUrls: ['./panel-attendance-managerment.component.less']
})
export class PanelAttendanceManagermentComponent implements OnInit {

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
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }

  @Input() employeeId: any;
  @Input() employeeCode: any;
  @Input() workingDay: any;
  @Input() departmentId: any;

  constructor(
    private formBuilder: FormBuilder,
    private attendanceService: AttendanceService,
    private toastService: ToastService,
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
    const queryModel = {
      employeeId: this.employeeId ? this.employeeId : null,
      employeeCode: this.employeeCode ? this.employeeCode.trim() : null,
      workingDay: this.workingDay ? this.workingDay : null,
      departmentId: this.departmentId ?  this.departmentId : null,
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.attendanceService.searchAttendance(queryModel, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.data;
        this.total = res.data.dataCount;
        if (this.lstData.length === 0) {
          if (this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        }
      } else {
        this.toastService.openErrorToast("Lỗi hệ thống");
      }
    }, error => {
      // this.toastService.openErrorToast(error.error.msgCode);
      this.toastService.openErrorToast("Lỗi hệ thống");
    });
  }



}
