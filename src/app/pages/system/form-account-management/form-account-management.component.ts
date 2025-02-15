import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {PositionService} from "../../../service/position.service";
import {ToastService} from "../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DepartmentService} from "../../../service/department.service";
import {AccountService} from "../../../service/account.service";

@Component({
  selector: 'app-form-account-management',
  templateUrl: './form-account-management.component.html',
  styleUrls: ['./form-account-management.component.less']
})
export class FormAccountManagementComponent implements OnInit {

  @Input() emailForm?: any;
  @Input() rolesForm?: any;
  @Input() isVisibleModal = false;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();
  listOfOption: string[] = [
    'ADMIN',
    'USER'
  ];

  createForm!: FormGroup;
  lstDepartment: any[] = [];
  payloadDepartment = {name: null, status: null};
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private  accountService:AccountService,
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      id: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      roles: [[]],
    });
    const rolesArray = this.rolesForm.split(',').map((res: any) => res.trim());
    setTimeout(() => {
      this.createForm.get('email')?.setValue(this.emailForm);
      this.createForm.get('roles')?.setValue(rolesArray);
    });
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
      data.email = data.email ? data.email : null;
      data.roleNames = data.roles ? data.roles : null;
      this.accountService.updateRole(data.email, data.roleNames).subscribe(res => {
        if (res && res.code === "OK") {
          this.toastService.openSuccessToast('Cập nhật vai trò thành công');
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
