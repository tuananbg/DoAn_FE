import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {WageService} from "../../../../service/wage.service";
import {EmployeeService} from "../../../../service/employee.service";

@Component({
  selector: 'app-form-wage-for-employee',
  templateUrl: './form-wage-for-employee.component.html',
  styleUrls: ['./form-wage-for-employee.component.less']
})
export class FormWageForEmployeeComponent implements OnInit {

  @Input() wageIdForm?: any;
  @Input() idUserWageForm?: any;
  @Input() licenseDateForm?: any;
  @Input() empSignForm?: any;
  @Input() isVisibleModal = false;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  isLoading = false;
  licenseDate: any;
  idUserDetail: any;
  lstWageType = [];
  payloadWage = {wageName: null, createdDate: null};
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
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
    private wageService: WageService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private i18n: NzI18nService,
    private employeeService: EmployeeService
  ) {
    this.idUserDetail = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.createForm = this.formBuilder.group({
      id: new FormControl(null),
      wageId: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      licenseDate: new FormControl(null, [Validators.required]),
      empSign: new FormControl(null, [Validators.required]),
    });
    setTimeout(() => {
      this.createForm.get('id')?.setValue(this.idUserWageForm);
      this.createForm.get('wageId')?.setValue(this.wageIdForm);
      this.createForm.get('licenseDate')?.setValue(this.licenseDateForm);
      this.createForm.get('empSign')?.setValue(this.empSignForm);
    });
    this.fetchWage();
    this.fetchEmployee();
  }

  handleCancelModal(): void {
    this.modal.destroy();
  }

  handleOkModal() {
    for (const i in this.createForm.controls) {
      this.createForm.controls[i].markAsDirty();
      this.createForm.controls[i].updateValueAndValidity();
    }
    if (this.createForm.valid) {
      const data = this.createForm.value;
      data.id = data.id ? data.id : null;
      data.contractId = data.wageId === 0 ? 0 : !data.wageId ? null : data.wageId;
      data.licenseDate = data.licenseDate ? data.licenseDate : null;
      data.empSign = data.empSign ? data.empSign : null;
      data.userDetailId = this.idUserDetail;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.wageService.createForEmployee(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới hợp đồng cho nhân viên thành công');
            this.clickSave.emit();
            this.createForm.reset();
            this.isLoading = true;
            this.handleCancelModal();
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
        this.wageService.editForEmployee(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật hợp đồng cho nhân viên thành công');
            this.clickSave.emit();
            this.clickCancel.emit();
            this.isLoading = true;
            this.handleCancelModal();
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

  fetchWage() {
    this.wageService.search(this.payloadWage, {page: 0, size: -1}).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstWageType = res.data.data;
        // this.lstWageType.sort((a, b) => a.contractCode.localeCompare(b.contractCode));
      }
    }, (error: any) => {
      console.log(error);
    })
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
