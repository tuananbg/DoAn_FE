import {Component, OnInit, ViewChild} from '@angular/core';
import {AttendanceService} from "../../../../service/attendance.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenService} from "../../../../service/screen.service";
import {
  DxTooltipComponent,
  DxSchedulerComponent,
} from "devextreme-angular";
import {DxSchedulerTypes} from "devextreme-angular/ui/scheduler";
import DataSource from 'devextreme/data/data_source';
import {EmployeeService} from "../../../../service/employee.service";
import {NzDrawerPlacement} from "ng-zorro-antd/drawer";
import {DepartmentService} from "../../../../service/department.service";
import * as moment from "moment";
import {FileManagerService} from "../../../../service/file-manager.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

type SelectedAppointment = { data: Record<string, any>, target: any };

@Component({
  selector: 'app-list-attendance-managerment',
  templateUrl: './list-attendance-managerment.component.html',
  styleUrls: ['./list-attendance-managerment.component.less']
})
export class ListAttendanceManagermentComponent implements OnInit {

  isActive = true;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'createdDate/desc', // -: desc | +: asc,
  };
  isLoadingOne = false;
  isLoadingTwo = false;
  backgroundColorOne: string = '';
  backgroundColorTwo: string = '';
  isDisabled = false;
  isDisabledTwo = false;
  form!: FormGroup;
  userCode: any;
  id: any;
  @ViewChild('schedulerRef', {static: false}) schedulerRef!: DxSchedulerComponent;
  @ViewChild('tooltipRef', {static: false}) tooltipRef!: DxTooltipComponent;
  tasks: DataSource<Task> = new DataSource<Task, any>([]);
  currentDate = new Date();
  currentView: DxSchedulerTypes.ViewType = 'month';
  resourcesList = [];
  selectedAppointment: SelectedAppointment | null = null;
  schedulerCurrentDate: Date = this.currentDate;
  lstData: any[] = [];
  total = 0;
  visible = false;
  placement: NzDrawerPlacement = 'top';
  selectedOptionDepartment = "";
  selectedOptionEmployee = "";
  payloadDepartment = {name: null, status: null};
  payloadEmployee = {employeeCode: null, employeeName: null, employeeEmail: null, employeeGender: null, positionId: null, departmentId: null};
  lstDepartment: any[] = [];
  lstEmployee: any[] = [];
  isView: boolean = false;
  dateNow: any;

  constructor(
    private attendanceService: AttendanceService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
    protected screen: ScreenService,
    private fileManagerService: FileManagerService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.dateNow = new Date();
    this.userCode = localStorage.getItem('employeeCode');
    this.form = this.formBuilder.group({
      employeeCode: [null, Validators.required]
    });
    this.form.get('employeeCode')?.valueChanges.subscribe(employeeCode => {
      if (employeeCode) {
        this.loadAttendanceId(employeeCode);
      }
    });

    this.loadAttendanceId(this.userCode);
    this.fetchEmployee();
  }

  // nzOnSearch(): void {
  //   this.request.currentPage = 0;
  //   // this.fetchData(this.request.currentPage, this.request.pageSize);
  // }

  // parseJwt(token: string): string {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
  //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join(''));
  //
  //   return JSON.parse(jsonPayload);
  // };

  fetchData(currentPage?: number, pageSize?: number) {
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.employeeService.searchEmployee(null, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.data;
        this.resourcesList = res.data.data;
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

  loadAttendanceId(employeeCode: string) {
    console.log("employeeCode", employeeCode);
    this.attendanceService.getAttendanceId(employeeCode).subscribe(res => {
      if (res && res.code === "OK" && res.data) {
        console.log("data2:", res);

        this.id = res.data.id;

        if (res.data.status === 1) {
          this.isDisabled = true;
          this.isDisabledTwo = false;
        } else if (res.data.status === 2) {
          this.isDisabled = true;
          this.isDisabledTwo = true;
        } else {
          this.isDisabled = false;
          this.isDisabledTwo = false;
        }

      } else {
        this.spinner.hide().then();
      }
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
      this.spinner.hide().then();
    });
  }


  // onEmployeeCodeChange(employeeCode: string) {
  //   if (employeeCode) {
  //     this.loadAttendanceId(employeeCode);
  //   }
  // }


  loadStartDate(): void {
    this.isLoadingOne = true;
    // 👇 Lấy employeeCode từ form ra
    const employeeCode = this.form.get('employeeCode')?.value;
    const data = { id: null, employeeCode: employeeCode};

    this.spinner.show().then();
    console.log("data :", data);

    this.attendanceService.createAttendance(data).subscribe(res => {
      if (res && res.body.code === "201") {
        this.id = res.id;
        console.log("id:" + this.id);
        this.toastService.openSuccessToast('Đã chấm công thành công, xin cảm ơn!');
        this.loadAttendanceId(employeeCode);
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
        this.spinner.hide().then();
      }
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
      this.spinner.hide().then();
    }, () => {
      this.spinner.hide().then();
    });

    setTimeout(() => {
      this.isLoadingOne = false;
    }, 3000);
  }


  loadEndDate(): void {
    this.isLoadingTwo = true;
    const employeeCode = this.form.get('employeeCode')?.value;
    const data = {
      id: this.id,
      employeeCode: employeeCode,
    };
    console.log("data :", data);
    this.attendanceService.editAttendance(data).subscribe(res => {
      if (res && res.code === "202") {
        this.toastService.openSuccessToast('Đã chấm công thành công, xin cảm ơn!');
        this.isDisabledTwo = true;
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
    }, () => {
      this.spinner.hide().then();
    });

    setTimeout(() => {
      this.isLoadingTwo = false;
    }, 3000);
  }


  onSelectedDateChange = (e?: Date) => {
    const date = e instanceof Date ? e : new Date();
    this.currentDate = date;
    this.selectedAppointment = {data: {startDate: date}, target: undefined};
  }

  repaintScheduler() {
    setTimeout(() => this.schedulerRef?.instance.repaint(), 0);
  }

  onCalendarDateChange = (date: any) => {
    console.log("Date:",date)
    this.currentDate = date;
    this.repaintScheduler();
  };

  getSchedulerCurrentDate = (currentDate: any) => {
    const schedulerInstance = this.schedulerRef?.instance;
    const startViewDate = schedulerInstance?.getStartViewDate();
    const endViewDate = schedulerInstance?.getEndViewDate();

    if (this.schedulerCurrentDate.getMonth() !== currentDate.getMonth() ||
      startViewDate && startViewDate > currentDate ||
      endViewDate && endViewDate < currentDate
    ) {
      this.schedulerCurrentDate = currentDate;
    }

    return this.schedulerCurrentDate;
  }

  onCellClick = ({cellData}: any) => {
    this.onSelectedDateChange(cellData.startDate);
    if (this.currentView === 'month' && cellData) {
      this.selectedAppointment = {data: cellData, target: null};
      this.visible = true;
    }
  };

  close(): void {
    this.visible = false;
  }

  fetchEmployee() {
    this.employeeService.getListSelect().subscribe(res => {
      if (res && res.code === "OK") {
        this.lstEmployee = res.data.map((item: any) => ({
          ...item,
          employeeName: item.employeeName + ' - ' + item.employeeCode
        }));
        this.lstEmployee.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
      }
    }, (error: any) => {
      console.log(error);
    });
  }


  // onOptionChangeDepartment(event: any): void {
  //   const selectedValue = event;
  //   console.log("Selected option:", selectedValue);
  //   const queryModel = this.payloadEmployee;
  //   queryModel.departmentId = event;
  //   this.selectedOptionEmployee = "";
  //   this.fetchEmployee();
  // }

  onOptionChangeEmployee(event: any): void {
    const selectedValue = event;
    console.log("Selected option:", selectedValue);
  }

  openExport() {
    const queryModel = {
      employeeCode: null,
      employeeId: this.selectedOptionEmployee ? this.selectedOptionEmployee  : null,
      employeeName: null,
      departmentId: null,
      workingDay: this.currentDate ? this.currentDate : null,
    };
    this.spinner.show().then();
    this.attendanceService.exportAttendance(queryModel).subscribe(async response => {
      const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
      const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
      if (typeof responseData === "string") {
        const responseJson = JSON.parse(responseData);
        this.toastService.openErrorToast(responseJson.msgCode);
      } else {
        const currentDate = moment();
        const formattedDate = currentDate.format('DD-MM-YYYY');
        this.fileManagerService.downloadFile(response, 'bang_thong_ke_cham_cong_'+formattedDate+'.xlsx');
      }
    }, error => {
      this.toastService.openErrorToast(error.body.msgCode);
    }, () => {
      this.spinner.hide().then();
    });
  }

}
