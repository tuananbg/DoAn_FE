import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../service/toast.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ProjectService} from "../../../../service/project.service";
import {EmployeeService} from "../../../../service/employee.service";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {differenceInCalendarDays} from "date-fns";
import {TaskService} from "../../../../service/task.service";
import {TimeSheetService} from "../../../../service/timesheet.service";
import {NgxSpinnerService} from "ngx-spinner";
import { format } from 'date-fns';


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
  taskCode: any;
  responsePagination: any;
  isUpdate = false;
  isView = false;
  continueAdd: any = false;
  isViewConfirmCancel: any;
  data: any;
  addForm: any;
  addFormTimeSheet: any;
  createBy:any;
  lstEmployee: any[] = [];
  lstProject:any[] =[];
  lstTaskStatus: any[] = [
    {code: 1, name: "Chưa làm"},
    {code: 2, name: "Đang xử lý"},
    {code: 3, name: "Hoàn thành"},
  ];
  lstPriority: any[] = [
    {code: 1, name: "Thấp"},
    {code: 2, name: "Trung bình"},
    {code: 3, name: "Cao"},
  ];
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
    sort: 'createdDate/desc', // -: desc | +: asc,
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
    // this.idProject = this.activatedRoute.snapshot.params['projectId'];
    this.taskCode = this.activatedRoute.snapshot.params['taskCode'];
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);
    this.createBy =localStorage.getItem('employeeCode');
    // this.loadProject();
    this.checkIsViewOrUpdate();
    console.log("createBy",this.createBy)
    this.addForm = this.formBuilder.group({
      taskCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      taskName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(500)]),
      taskDescription: new FormControl(),
      taskStatus: new FormControl( [Validators.required]),
      startDay: new FormControl(null, [Validators.required]),
      endDay: new FormControl(null, [Validators.required]),
      employeeCode: new FormControl( [Validators.required]),
      managerCode:new FormControl([Validators.required]),
      projectCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      duration: new FormControl(null),
      communication: new FormControl(null),
      employees: [[]],
    });
    if (this.isUpdate || this.isView) {
      this.taskService.getTaskCode(this.taskCode).subscribe(res => {
        if (res && res.code === "OK") {
          console.log("data",res.data)
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
      this.fetchProject();
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  buildFormTimeSheet() {
    this.addFormTimeSheet = this.formBuilder.group({
      content: new FormControl(null, [Validators.maxLength(1000)]),
    });
  }

  // loadProject() {
  //   this.projectService.getProjectId(this.idProject).subscribe(res => {
  //     if (res && res.code === "OK") {
  //       const dataProject = res.data;
  //       this.projectName = dataProject.projectName;
  //     } else {
  //       this.toastService.openErrorToast(res.msgCode);
  //     }
  //   });
  // }

  checkIsViewOrUpdate() {
    console.log('checkIsViewOrUpdate',this.router.url);
    if (this.router.url.includes("/view")) {
      this.isView = true;
    } else if (this.router.url.includes("/update")) {
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
      data.taskCode = data.taskCode.trim() || null;
      data.taskName = data.taskName.trim() || null;
      data.taskDescription = data.taskDescription.trim() || null;
      data.managerCode = data.managerCode ? data.managerCode : null;
      data.startDay = data.startDay ? format(new Date(data.startDay), 'yyyy-MM-dd HH:mm:ss') : null;
      data.endDay = data.endDay ? format(new Date(data.endDay), 'yyyy-MM-dd HH:mm:ss') : null;
      data.taskStatus = data.taskStatus ? data.taskStatus : null;
      data.projectCode = data.projectCode ? data.projectCode : null;
      data.priority = data.priority ? data.priority : null;
      // data.duration = data.duration ? data.duration : null;
      // data.communication = data.communication ? data.communication : null;
      data.employeeCode = data.employeeCode ? data.employeeCode : null;
      if (this.isUpdate) {
        // data.startDay = new Date(data.startDay);
        // data.endDay = new Date(data.endDay);
        this.taskService.edit(data).subscribe(res => {
          if (res && res.code === "202") {
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
          if (res && res.code === "201") {
            this.toastService.openSuccessToast("Thêm mới thành công");
            this.clickSave.emit();
            this.addForm.reset();
            if (!this.continueAdd) {
              this.goBack();
            } else {
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
    this.router.navigate(['/task-list']);
  }

  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }

  fetchEmployee() {
    this.employeeService.getListSelect().subscribe(res => {
      if (res && res.code === "OK") {
        this.lstEmployee = res.data;
        this.listOfOption =  this.lstEmployee.map(res => `${res.employeeName} - ${res.employeeCode}`);
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

  fetchProject() {
    this.projectService.getListSelect().subscribe(res => {
      if (res && res.code === "OK") {
        this.lstProject = res.data;
        this.listOfOption =  this.lstProject.map(res => `${res.projectName} - ${res.projectCode}`);
        this.lstProject = this.lstProject.map(item => ({
          ...item,
          projectName: item.projectName + " - " + item.projectCode
        }));
        this.lstProject.sort((a, b) => a.projectName.localeCompare(b.projectName));
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
    console.log("click")
    if (this.addFormTimeSheet.valid) {
      const data = this.addFormTimeSheet.value;
      data.taskCode = this.taskCode;
      data.content = data.content ? data.content : null;
      data.employeeCode = this.createBy ;
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
    if(this.taskCode!=null){
      this.timeSheetService.search(this.taskCode).subscribe(res => {
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

