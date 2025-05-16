import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../../../../service/login.service";
import { AuthService } from "../../../../service/auth.service";
import { ToastService } from "../../../../service/toast.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { API_CONFIG } from "../../../../config/api-config";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {
  isMessageErrorThree = false;

  messageErrorThree = '';

  @Output() submitEM = new EventEmitter();
  hidePassword: boolean = true;

  changePasswordFormData = {
    account: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  formUsername: FormGroup = new FormGroup({
    account: new FormControl('', [Validators.required])
  });

  formChangePasswordConfirm: FormGroup = new FormGroup({
    account: new FormControl('', [Validators.required]),
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });


  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onChangeTab(): void {

  }

  verifyFormChangePasswordSubmit(): void {
    if (this.formChangePasswordConfirm.valid) {
      this.changePasswordFormData.account = this.formChangePasswordConfirm.value['account'];
      this.changePasswordFormData.currentPassword = this.formChangePasswordConfirm.value['currentPassword'];
      this.changePasswordFormData.newPassword = this.formChangePasswordConfirm.value['newPassword'];
      this.changePasswordFormData.confirmNewPassword = this.formChangePasswordConfirm.value['confirmNewPassword'];

      if (this.changePasswordFormData.newPassword !== this.changePasswordFormData.confirmNewPassword) {
        this.isMessageErrorThree = true;
        this.messageErrorThree = "Mật khẩu xác nhận không khớp!";
        return;
      }

      this.spinner.show().then();
      this.auth.changePassword(this.changePasswordFormData).subscribe({
        next: res => {
          this.notification.success("Thành công", "Đổi mật khẩu thành công");
          this.spinner.hide().then();
          this.router.navigate(['/auth/login']).then();
          this.onChangeTab();
        },
        error: err => {
          this.notification.error("Thất bại", err.error.msgCode);
          this.spinner.hide().then();
        }
      });
    } else {
      Object.values(this.formChangePasswordConfirm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
