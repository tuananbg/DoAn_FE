import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskForm, taskPriorityList, taskStatusList} from "../../../core/task";
import {getSizeQualifier, ScreenService} from "../../../service/screen.service";
import {DxButtonTypes} from "devextreme-angular/ui/button";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ProjectService} from "../../../service/project.service";
import {EmployeeService} from "../../../service/employee.service";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {differenceInCalendarDays} from "date-fns";
import {TaskService} from "../../../service/task.service";
import {TimeSheetService} from "../../../service/timesheet.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-task-form-management',
  templateUrl: './task-form-management.component.html',
  styleUrls: ['./task-form-management.component.less']
})
export class TaskFormManagementComponent implements OnInit, AfterViewChecked {

  public Editor = ClassicEditor;
  public editorConfig = {
    extraPlugins: [MyCustomUploadAdapterPlugin]
  };
  idProject: any;
  idTask: any;
  responsePagination: any;
  isUpdate = false;
  isView = false;
  continueAdd: any = false;
  isViewConfirmCancel: any;
  data: any;
  addForm: any;
  addFormTimeSheet: any;
  lstEmployee: any[] = [];
  lstTaskStatus: any[] = [
    {code: 1, name: "Mới"},
    {code: 2, name: "Đang xử lý"},
    {code: 3, name: "Review"},
    {code: 4, name: "Reopen"},
    {code: 5, name: "Hoàn thành"},
  ];
  lstPriority: any[] = [
    {code: 1, name: "Low"},
    {code: 2, name: "Normal"},
    {code: 3, name: "High"},
  ];
  payloadEmployee = {
    employeeCode: null,
    employeeName: null,
    employeeEmail: null,
    employeeGender: null,
    positionId: null,
    departmentId: null
  };
  startDayErrorMessage = '';
  endDayErrorMessage = '';
  avatarFile!: File;
  listOfOption: string[] = [];
  projectName!: string;
  lstData: any[] = [];
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  idTimeSheet: any;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'created_date,desc', // -: desc | +: asc,
  };


  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();


  constructor(
    private router: Router,
    private toastService: ToastService,
    private spinner:NgxSpinnerService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private timeSheetService: TimeSheetService,
    private i18n: NzI18nService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.idProject = this.activatedRoute.snapshot.params['projectId'];
    this.idTask = this.activatedRoute.snapshot.params['taskId'];
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);
    this.loadProject();
    this.checkIsViewOrUpdate();
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const genderCode = year + month + day + hours + minutes;
    this.addForm = this.formBuilder.group({
      taskCode: 'T' + genderCode,
      taskName: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      taskDescription: new FormControl(null),
      taskStatus: new FormControl(null, [Validators.required]),
      startDay: new FormControl(null, [Validators.required]),
      endDay: new FormControl(null, [Validators.required]),
      followId: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      duration: new FormControl(null),
      communication: new FormControl(null),
      employees: [[]],
    });
    if (this.isUpdate || this.isView) {
      this.taskService.getTaskId(this.idTask).subscribe(res => {
        if (res && res.code === "OK") {
          const dataProject = res.data;
          this.data = dataProject;
          this.addForm.patchValue(dataProject);
          this.addForm.get('employees')?.setValue(this.data.employees);
        } else {
          this.toastService.openErrorToast(res.msgCode);
        }
      });
    }
    this.buildFormTimeSheet();
    this.fetchData();
    setTimeout(() => {
      this.fetchEmployee();
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  buildFormTimeSheet() {
    this.addFormTimeSheet = this.formBuilder.group({
      dayTimeSheet: new FormControl(null),
      durationTimeSheet: new FormControl(null),
      timeSheetDescription: new FormControl(null, [Validators.maxLength(1000)]),
    });
  }

  loadProject() {
    this.projectService.getProjectId(this.idProject).subscribe(res => {
      if (res && res.code === "OK") {
        const dataProject = res.data;
        this.projectName = dataProject.projectName;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
    });
  }

  checkIsViewOrUpdate() {
    if (this.router.url.includes("/view")) {
      this.isView = true;
    } else if (this.router.url.includes("/detail")) {
      this.isUpdate = true;
    } else {
      this.isView = false;
      this.isUpdate = false;
    }
  }

  submitForm() {
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsDirty();
      this.addForm.controls[i].updateValueAndValidity();
    }
    if (this.addForm.valid) {
      const data = this.addForm.getRawValue();
      data.id = Number(this.idTask) || null;
      data.taskCode = data.taskCode.trim() || null;
      data.taskName = data.taskName.trim() || null;
      data.taskDescription = data.taskDescription.trim() || null;
      data.followId = data.followId ? data.followId : null;
      data.startDay = data.startDay ? data.startDay : null;
      data.endDay = data.endDay ? data.endDay : null;
      data.taskStatus = data.taskStatus ? data.taskStatus : null;
      data.projectId = Number(this.idProject) ? Number(this.idProject) : null;
      data.priority = data.priority ? data.priority : null;
      data.duration = data.duration ? data.duration : null;
      data.communication = data.communication ? data.communication : null;
      data.employees = data.employees ? data.employees : null;
      if (this.isUpdate) {
        data.startDay = new Date(data.startDay);
        data.endDay = new Date(data.endDay);
        this.taskService.edit(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast("Cập nhật thành công");
            this.clickSave.emit();
            this.addForm.reset();
            this.goBack();
          } else {
            this.toastService.openErrorToast(res.msgCode);
            this.addForm.controls.code.setErrors({'error': true});
          }
        }, error => {
          this.toastService.openErrorToast(error.msgCode);
          console.log(error);
        });
      } else {
        this.taskService.create(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast("Thêm mới thành công");
            this.clickSave.emit();
            this.addForm.reset();
            if (!this.continueAdd) {
              this.goBack();
            } else {
              const currentDate = new Date();
              const year = currentDate.getFullYear().toString();
              const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
              const day = currentDate.getDate().toString().padStart(2, '0');
              const hours = currentDate.getHours().toString().padStart(2, '0');
              const minutes = currentDate.getMinutes().toString().padStart(2, '0');
              const genderCode = year + month + day + hours + minutes;
              this.addForm.get('taskCode').setValue('T' + genderCode);
              this.continueAdd = false;
            }
          } else {
            this.toastService.openErrorToast(res.msgCode);
            this.addForm.controls.code.setErrors({'error': true});
          }
        }, error => {
          console.log(error);
        });
      }
    }
  }


  cancelConfirm() {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/task-board/', this.idProject],
      {
        state: {
          response: this.responsePagination,
          isCreate: false,
        },
      }).then();
  }

  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }

  fetchEmployee() {
    this.employeeService.searchEmployee(this.payloadEmployee, {page: 0, size: -1}).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstEmployee = res.data.data;
        this.listOfOption = this.lstEmployee.map(res => `${res.employeeName} - ${res.employeeCode}`);
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

  onChangeStartDay(event: any) {
    if (event) {
      const startDay = new Date(event);
      this.startDayErrorMessage = '';
      if (this.addForm.getRawValue().endDay) {
        const endDay = new Date(this.addForm.getRawValue().endDay);
        if (startDay >= endDay) {
          this.addForm.get('startDay')?.setErrors({
            'lessThanExpire': true
          });
          this.startDayErrorMessage = this.startDayErrorMessage + 'Ngày bắt đầu phải trước Ngày kết thúc';
          this.addForm.get('startDay')?.markAsDirty();
          return;
        } else {
          this.addForm.get('startDay')?.setErrors(null);
          this.addForm.get('endDay')?.setErrors(null);
          this.startDayErrorMessage = '';
          this.endDayErrorMessage = '';

        }
      }
    } else {
      if (this.addForm.get('startDay')?.touched) {
        this.addForm.get('startDay')?.setErrors({
          'required': true
        });
        this.startDayErrorMessage = 'Ngày bắt đầu không được để trống';
        this.addForm.get('startDay')?.markAsDirty();
      }
    }
  }

  onChangeEndDay(event: any) {
    if (event) {
      const endDay = new Date(event);
      if (event && this.addForm.getRawValue().startDay) {
        const startDay = new Date(this.addForm.getRawValue().startDay);
        if (endDay <= startDay) {
          this.addForm.get('endDay')?.setErrors({
            'lessThanExpire': true
          });
          this.endDayErrorMessage = 'Ngày kết thúc phải sau Ngày bắt đầu';
          return;
        } else {
          this.onChangeStartDay(this.addForm.getRawValue().startDay);
          this.addForm.get('endDay')?.setErrors(null);
          this.endDayErrorMessage = '';
        }
      }
    } else {
      if (this.addForm.get('endDay')?.touched) {
        this.addForm.get('endDay')?.setErrors({
          'required': true
        });
        this.endDayErrorMessage = 'Ngày kết thúc không được để trống';
        this.addForm.get('endDay')?.markAsDirty();
      }
    }
  }

  submitTimeSheetForm(): void {
    if (this.addFormTimeSheet.valid) {
      const data = this.addFormTimeSheet.value;
      data.taskId = this.idTask;
      data.dayTimeSheet = data.dayTimeSheet ? data.dayTimeSheet : null;
      data.durationTimeSheet = data.durationTimeSheet ? data.durationTimeSheet : null;
      data.timeSheetDescription = data.timeSheetDescription ? data.timeSheetDescription : null;
      this.timeSheetService.create(data).subscribe(res => {
        if (res && res.code === "OK") {
          this.toastService.openSuccessToast('Lưu thành công');
          this.addFormTimeSheet.reset();
          this.fetchData();
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
      });
    }
  }

  fetchData() {
    if(this.idTask!=null){
      this.timeSheetService.search(this.idTask).subscribe(res => {
        if (res && res.code === "OK") {
          this.lstData = res.data;
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
      }, error => {
        this.toastService.openErrorToast(error.error.msgCode);
      });
    }
  }

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.idTimeSheet = item.id;
    }
  }

  callBackModalDelete() {
    this.timeSheetService.deleteTimeSheet(this.idTimeSheet).subscribe(res => {
      if (res && res.code === "OK") {
        this.toastService.openSuccessToast('Xóa time sheet thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
      this.fetchData();
    });
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData();
  }

}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}


export class MyUploadAdapter {
  loader: any;
  url: string;
  xhr!: XMLHttpRequest;

  constructor(loader: any) {
    this.loader = loader;
    this.url = 'YOUR_UPLOAD_URL'; // Địa chỉ URL để upload ảnh
  }

  upload() {
    return this.loader.file
      .then((file: any) => new Promise((resolve, reject) => {
        this._initRequest();
        // this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  private _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();
    xhr.open('POST', this.url, true);
    xhr.responseType = 'json';
  }

  // private _initListeners(resolve: any, reject: any, file: any) {
  //   const xhr = this.xhr;
  //   const loader = this.loader;
  //   const genericErrorText = `Couldn't upload file: ${file.name}.`;
  //
  //   xhr.addEventListener('error', () => reject(genericErrorText));
  //   xhr.addEventListener('abort', () => reject());
  //   xhr.addEventListener('load', () => {
  //     const response = xhr.response;
  //
  //     if (!response || response.error) {
  //       return reject(response && response.error ? response.error.message : genericErrorText);
  //     }
  //
  //     resolve({
  //       default: response.url
  //     });
  //   });
  // }

  private _sendRequest(file: any) {
    const data = new FormData();
    data.append('upload', file);

    this.xhr.send(data);
  }
}

