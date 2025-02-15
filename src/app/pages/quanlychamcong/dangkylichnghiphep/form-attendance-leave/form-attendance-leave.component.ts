import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {AttendanceLeaveService} from "../../../../service/attendance-leave.service";
import {EmployeeService} from "../../../../service/employee.service";
import {differenceInCalendarDays} from "date-fns";

@Component({
  selector: 'app-form-attendance-leave',
  templateUrl: './form-attendance-leave.component.html',
  styleUrls: ['./form-attendance-leave.component.less']
})
export class FormAttendanceLeaveComponent implements OnInit, OnChanges {

  createForm!: FormGroup;
  @Input() isUpdate: any;
  @Input() idChild: any;
  @Input() visible: any;
  @Input() objectChild: any;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  lstLeaveCategory = [
    {id: 1, name: "Nghỉ tính phép"},
    {id: 0, name: "Nghỉ không phép"}
  ]
  idUserDetailId: any;
  startDayErrorMessage = '';
  endDayErrorMessage = '';
  lstEmployee: any[] = [];
  payloadEmployee = {
    employeeCode: null,
    employeeName: null,
    employeeEmail: null,
    employeeGender: null,
    positionId: null,
    departmentId: null
  };


  constructor(
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private attendanceLeaveService: AttendanceLeaveService,
    private employeeService: EmployeeService
  ) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.createForm) {
      if (this.idChild != null) {
        this.createForm.reset();
        setTimeout(() => {
          this.createForm.get('leaveCategory')?.setValue(this.objectChild.leaveCategory);
          this.createForm.get('startDay')?.setValue(this.objectChild.startDay);
          this.createForm.get('endDay')?.setValue(this.objectChild.endDay);
          this.createForm.get('totalTime')?.setValue(this.objectChild.totalTime);
          this.createForm.get('reviewerId')?.setValue(this.objectChild.reviewerId);
          this.createForm.get('trackerId')?.setValue(this.objectChild.trackerId);
          this.createForm.get('description')?.setValue(this.objectChild.description);
        });
      } else {
        this.createForm.reset();
      }
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.idUserDetailId = userObject.userDetailId;
    this.createForm = this.formBuilder.group({
      leaveCategory: new FormControl(null, [Validators.required]),
      startDay: new FormControl(null, [Validators.required]),
      endDay: new FormControl(null, [Validators.required]),
      totalTime: new FormControl(null),
      employeeId: new FormControl(null),
      reviewerId: new FormControl(null, [Validators.required]),
      trackerId: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.maxLength(5000)])
    })
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


  handleOkModal() {
    for (const i in this.createForm.controls) {
      this.createForm.controls[i].markAsDirty();
      this.createForm.controls[i].updateValueAndValidity();
    }
    if (this.createForm.valid) {
      const data = this.createForm.value;
      data.leaveID = this.idChild ? this.idChild : null;
      data.leaveCategory = data.leaveCategory === 0 ? 0 : !data.leaveCategory ? null : data.leaveCategory;
      data.startDay = data.startDay ? data.startDay : null;
      data.endDay = data.endDay ? data.endDay : null;
      data.totalTime = data.totalTime ? data.totalTime : null;
      data.employeeId = this.idUserDetailId ? this.idUserDetailId : null;
      data.reviewerId = data.reviewerId ? data.reviewerId : null;
      data.trackerId = data.trackerId ? data.trackerId : null;
      data.description = data.description ? data.description.trim() : null;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.attendanceLeaveService.createAttendanceLeave(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Đăng ký lịch nghỉ thành công');
            this.clickSave.emit();
            this.createForm.reset();
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
      } else {
        this.attendanceLeaveService.editAttendanceLeave(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Sửa lịch nghỉ phép thành công');
            this.clickSave.emit();
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
  }

  close(): void {
    this.clickCancel.emit();
  }

  onChangeStartDay(event: any) {
    if (event) {
      const startDay = new Date(event);
      this.startDayErrorMessage = '';
      if (this.createForm.getRawValue().endDay) {
        const endDay = new Date(this.createForm.getRawValue().endDay);
        if (startDay >= endDay) {
          this.createForm.get('startDay')?.setErrors({
            'lessThanExpire': true
          });
          this.startDayErrorMessage = this.startDayErrorMessage + 'Ngày bắt đầu phải trước Ngày kết thúc';
          this.createForm.get('startDay')?.markAsDirty();
          return;
        } else {
          this.createForm.get('startDay')?.setErrors(null);
          this.createForm.get('endDay')?.setErrors(null);
          this.startDayErrorMessage = '';
          this.endDayErrorMessage = '';

          const start = new Date(event).getTime();
          const end = new Date(this.createForm.getRawValue().endDay).getTime();
          const millisecondsPerDay = 1000 * 60 * 60 * 24;
          const differenceMilliseconds = end - start;
          const numberOfDays = Math.floor(differenceMilliseconds / millisecondsPerDay);
          this.createForm.get('totalTime')?.setValue(numberOfDays);

        }
      }
    } else {
      if (this.createForm.get('startDay')?.touched) {
        this.createForm.get('startDay')?.setErrors({
          'required': true
        });
        this.startDayErrorMessage = 'Ngày bắt đầu không được để trống';
        this.createForm.get('startDay')?.markAsDirty();
      }
    }
  }

  onChangeEndDay(event: any) {
    if (event) {
      const endDay = new Date(event);
      if (event && this.createForm.getRawValue().startDay) {
        const startDay = new Date(this.createForm.getRawValue().startDay);
        if (endDay <= startDay) {
          this.createForm.get('endDay')?.setErrors({
            'lessThanExpire': true
          });
          this.endDayErrorMessage = 'Ngày kết thúc phải sau Ngày bắt đầu';
          return;
        } else {
          this.onChangeStartDay(this.createForm.getRawValue().startDay);
          this.createForm.get('endDay')?.setErrors(null);
          this.endDayErrorMessage = '';

          const end = new Date(event).getTime();
          const start = new Date(this.createForm.getRawValue().startDay).getTime();
          const millisecondsPerDay = 1000 * 60 * 60 * 24;
          const differenceMilliseconds = end - start;
          const numberOfDays = Math.floor(differenceMilliseconds / millisecondsPerDay);
          this.createForm.get('totalTime')?.setValue(numberOfDays);
        }
      }
    } else {
      if (this.createForm.get('endDay')?.touched) {
        this.createForm.get('endDay')?.setErrors({
          'required': true
        });
        this.endDayErrorMessage = 'Ngày kết thúc không được để trống';
        this.createForm.get('endDay')?.markAsDirty();
      }
    }
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

  isDisableDateFromToday = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

}
