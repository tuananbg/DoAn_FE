import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../service/toast.service";
import {EmployeeService} from "../../../../service/employee.service";
import {differenceInCalendarDays} from "date-fns";
import {ProjectService} from "../../../../service/project.service";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: 'app-create-project-management',
  templateUrl: './create-project-management.component.html',
  styleUrls: ['./create-project-management.component.less']
})
export class CreateProjectManagementComponent implements OnInit, AfterViewChecked {

  public Editor = ClassicEditor;
  idProject;
  responsePagination: any;
  isUpdate = false;
  isView = false;
  continueAdd: any = false;
  isViewConfirmCancel: any;
  data: any;
  addForm: any;
  lstEmployee: any[] = [];  payloadEmployee = {
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
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  previewTitle: string | undefined = '';
  listOfOption: string[] = [];

  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();


  constructor(
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private i18n: NzI18nService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.idProject = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);
    this.checkIsViewOrUpdate();
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const genderCode = year + month + day + hours + minutes;
    this.addForm = this.formBuilder.group({
      projectCode: 'DA'+genderCode,
      projectName: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      customerName: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      projectManagerId: new FormControl(null, [Validators.required]),
      startDay: new FormControl(null, [Validators.required]),
      endDay: new FormControl(null, [Validators.required]),
      projectDescription: new FormControl(null),
      employees: [[]],
    });
    if (this.isUpdate || this.isView) {
      this.projectService.getProjectId(this.idProject).subscribe(res => {
        if (res && res.code === "OK") {
          const dataProject = res.data;
          this.data = dataProject;
          this.addForm.patchValue(dataProject);
          this.addForm.get('employees')?.setValue(this.data.employees);
          this.fileList = [
            {
              uid: '-1',
              name: this.data.customerAvatar,
              status: 'done',
              url: 'http://localhost:8080/api/v1/project/'+ this.data.customerAvatar // Đường dẫn đến ảnh đã tải lên
            }
          ];
        } else {
          this.toastService.openErrorToast(res.msgCode);
        }
      });
    }
    setTimeout(() => {
      this.fetchEmployee();
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
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
      data.id = this.idProject;
      data.projectCode = data.projectCode.trim();
      data.projectName = data.projectName.trim();
      data.projectDescription = data.projectDescription.trim();
      data.projectManagerId = data.projectManagerId ? data.projectManagerId : null;
      data.startDay = data.startDay ? data.startDay : null;
      data.endDay = data.endDay ? data.endDay : null;
      data.customerName = data.customerName.trim();
      data.employees = data.employees ? data.employees : null;
      const avatarFile = this.fileList[0].originFileObj;
      if (this.isUpdate) {
        data.startDay = new Date(data.startDay);
        data.endDay = new Date(data.endDay);
        this.projectService.editProject(avatarFile!, data).subscribe(res => {
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
          console.log(error);
        });
      } else {
        this.projectService.create(avatarFile!, data).subscribe(res => {
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
              this.addForm.get('projectCode').setValue('DA'+genderCode);
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
    this.router.navigate(['/project'],
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

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
    this.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  handleCancel = () => this.previewVisible = false;

  getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.toastService.openErrorToast('File upload phải là JPG/PNG !');
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.toastService.openErrorToast('File upload phải lớn hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };



}
