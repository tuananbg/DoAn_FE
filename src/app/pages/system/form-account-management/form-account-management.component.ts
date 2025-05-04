import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { ToastService } from "../../../service/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../../service/account.service";
import { RoleService } from "../../../service/role.service";

@Component({
  selector: 'app-form-account-management',
  templateUrl: './form-account-management.component.html',
  styleUrls: ['./form-account-management.component.less']
})
export class FormAccountManagementComponent implements OnInit {
  @Input() emailForm?: string;
  @Input() rolesForm?: any[]; // mảng Role[] từ BE
  @Input() employeeCodeForm?: string;
  @Input() fullNameForm?: string;
  @Input() isVisibleModal = false;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  isLoading = false;
  listOfOption: { code: string, name: string }[] = [];

  constructor(
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllRoles();
    this.patchInitialValues();
  }

  private initForm(): void {
    this.createForm = this.formBuilder.group({
      employeeCode: new FormControl({ value: '', disabled: this.isUpdate }),
      fullName: new FormControl({ value: '', disabled: this.isUpdate }),
      email: new FormControl(null, [Validators.required, Validators.email]),
      roles: new FormControl([], Validators.required),
    });
  }

  private getAllRoles(): void {
    this.roleService.selectRole().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.listOfOption = res.data;
        }
      },
      error: () => {
        this.toastService.openErrorToast('Không thể tải danh sách vai trò');
      }
    });
  }

  private patchInitialValues(): void {
    const roleCodes = this.rolesForm?.map((r: any) => r.code) || [];
    setTimeout(() => {
      this.createForm.patchValue({
        employeeCode: this.employeeCodeForm,
        fullName: this.fullNameForm,
        email: this.emailForm,
        roles: roleCodes
      });
    });
  }

  handleCancelModal(): void {
    this.modal.destroy();
  }

  handleOkModal(): void {
    for (const i in this.createForm.controls) {
      this.createForm.controls[i].markAsDirty();
      this.createForm.controls[i].updateValueAndValidity();
    }

    if (this.createForm.valid) {
      const formData = this.createForm.getRawValue();

      const dto = {
        employeeCode: formData.employeeCode,
        email: formData.email,
        roleCodes: formData.roles
      };

      console.log("data:",dto)

      this.accountService.updateRole(dto).subscribe({
        next: (res) => {
          if (res.code === '202') {
            this.toastService.openSuccessToast('Cập nhật vai trò thành công');
            this.clickSave.emit();
            this.clickCancel.emit();
            this.handleCancelModal();
          } else {
            this.toastService.openErrorToast(res?.body?.msgCode || 'Cập nhật thất bại');
          }
        },
        error: (err) => {
          this.toastService.openErrorToast(err.error.msgCode || 'Lỗi hệ thống');
        },
        complete: () => {
          this.spinner.hide().then();
        }
      });
    }
  }

}
