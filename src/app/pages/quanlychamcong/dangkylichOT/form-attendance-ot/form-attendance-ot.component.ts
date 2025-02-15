import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {AttendanceLeaveService} from "../../../../service/attendance-leave.service";
import {EmployeeService} from "../../../../service/employee.service";
import {AttendanceOTService} from "../../../../service/attendance-ot.service";
import {differenceInCalendarDays} from "date-fns";

@Component({
  selector: 'app-form-attendance-ot',
  templateUrl: './form-attendance-ot.component.html',
  styleUrls: ['./form-attendance-ot.component.less']
})
export class FormAttendanceOtComponent implements OnInit, OnChanges {

  createForm!: FormGroup;
  @Input() isUpdate: any;
  @Input() idChild: any;
  @Input() visible: any;
  @Input() objectChild: any;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  idUserDetailId: any;
  endTimeErrorMessage = '';
  startTimeErrorMessage = '';
  lstEmployee: any[] = [];
  payloadEmployee = {
    employeeCode: null,
    employeeName: null,
    employeeEmail: null,
    employeeGender: null,
    positionId: null,
    departmentId: null
  };

  isDisableDateFromToday = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  constructor(
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private attendanceOTService: AttendanceOTService,
    private employeeService: EmployeeService
  ) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.createForm) {
      if (this.idChild != null) {
        this.createForm.reset();
        setTimeout(() => {
          this.createForm.get('startDay')?.setValue(this.objectChild.startDay);
          this.createForm.get('startTime')?.setValue(this.objectChild.startTime);
          this.createForm.get('endTime')?.setValue(this.objectChild.endTime);
          this.createForm.get('totalTime')?.setValue(this.objectChild.totalTime);
          this.createForm.get('followId')?.setValue(this.objectChild.followId);
          this.createForm.get('descriptionOt')?.setValue(this.objectChild.descriptionOt);
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
      startDay: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      totalTime: new FormControl(null),
      employeeId: new FormControl(null),
      followId: new FormControl(null, [Validators.required]),
      descriptionOt: new FormControl(null, [Validators.maxLength(5000)])
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
      data.attendanceOtID = this.idChild ? this.idChild : null;
      data.startDay = data.startDay ? data.startDay : null;
      data.startTime = data.startTime ? data.startTime : null;
      data.totalTime = data.totalTime ? data.totalTime : null;
      data.employeeId = this.idUserDetailId ? this.idUserDetailId : null;
      data.followId = data.followId ? data.followId : null;
      data.descriptionOt = data.descriptionOt ? data.descriptionOt.trim() : null;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.attendanceOTService.createAttendanceOt(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Đăng ký lịch tăng ca thành công');
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
        this.attendanceOTService.editAttendanceOt(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Sửa lịch tăng ca thành công');
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

  onChangeStartTime(event: any) {
    if (event) {
      const startTime = new Date(event);
      this.startTimeErrorMessage = '';
      if (this.createForm.getRawValue().endTime) {
        const endTime = new Date(this.createForm.getRawValue().endTime);
        if (startTime >= endTime) {
          this.createForm.get('startTime')?.setErrors({
            'lessThanExpire': true
          });
          this.startTimeErrorMessage = this.startTimeErrorMessage + 'Thời gian bắt đầu phải trước Thời gian kết thúc';
          this.createForm.get('startTime')?.markAsDirty();
          return;
        } else {
          this.createForm.get('startTime')?.setErrors(null);
          this.createForm.get('endTime')?.setErrors(null);
          this.startTimeErrorMessage = '';
          this.endTimeErrorMessage = '';
          const endTimeForm = new Date(this.createForm.getRawValue().endTime).getTime();
          const startTimeForm = new Date(event).getTime();
          const timeDiffInMilliseconds =  endTimeForm - startTimeForm;
          const timeDiffInHours = (timeDiffInMilliseconds / (1000 * 60 * 60)).toFixed(1);
          this.createForm.get('totalTime')?.setValue(timeDiffInHours);
        }
      }
    } else {
      if (this.createForm.get('startTime')?.touched) {
        this.createForm.get('startTime')?.setErrors({
          'required': true
        });
        this.startTimeErrorMessage = 'Thời gian bắt đầu không được để trống';
        this.createForm.get('startTime')?.markAsDirty();
      }
    }
  }

  onChangeEndTime(event: any) {
    if (event) {
      const endTime = new Date(event);
      if (event && this.createForm.getRawValue().startTime) {
        const startTime = new Date(this.createForm.getRawValue().startTime);
        if (endTime <= startTime) {
          this.createForm.get('endTime')?.setErrors({
            'lessThanExpire': true
          });
          this.endTimeErrorMessage = 'Thời gian kết thúc phải sau Thời gian bắt đầu';
          return;
        } else {
          this.onChangeStartTime(this.createForm.getRawValue().startTime);
          this.createForm.get('endTime')?.setErrors(null);
          this.endTimeErrorMessage = '';
          const startTimeForm = new Date(this.createForm.getRawValue().startTime).getTime();
          const endTimeForm = new Date(event).getTime();
          const timeDiffInMilliseconds =  endTimeForm - startTimeForm;
          const timeDiffInHours = (timeDiffInMilliseconds / (1000 * 60 * 60)).toFixed(1);
          this.createForm.get('totalTime')?.setValue(timeDiffInHours);
        }
      }
    } else {
      if (this.createForm.get('endTime')?.touched) {
        this.createForm.get('endTime')?.setErrors({
          'required': true
        });
        this.endTimeErrorMessage = 'Thời gian kết thúc không được để trống';
        this.createForm.get('endTime')?.markAsDirty();
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


}
