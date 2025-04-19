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
  isMessageError = false;
  isMessageErrorTwo = false;
  isMessageErrorThree = false;

  messageError = '';
  messageErrorTwo = '';
  messageErrorThree = '';

  @Output() submitEM = new EventEmitter();
  hidePassword: boolean = true;

  isTabOne = true;
  isTabTwo = false;
  isTabThree = false;

  registerFormData = {
    account: '',
    password: '',
    confirmPassword: ''
  };

  formUsername: FormGroup = new FormGroup({
    account: new FormControl('', [Validators.required])
  });

  formCodeConfirm: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  formChangePasswordConfirm: FormGroup = new FormGroup({
    account: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private loginService: LoginService,
    private auth: AuthService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onChangeTab(): void {
    this.isTabOne = true;
    this.isTabTwo = false;
    this.isTabThree = false;
  }

  verifyUsernameFormSubmit(): void {
    if (this.formUsername.valid) {
      const account = this.formUsername.value['account'];
      this.spinner.show().then();
      this.http.get(API_CONFIG.BASE_URL + `auth/forgot-password/${account}`).subscribe({
        next: res => {
          this.isTabOne = false;
          this.isTabTwo = true;
          this.isMessageError = false;
          this.formChangePasswordConfirm.get('account')?.setValue(account);
          this.notification.success("Thành công", "Mã xác thực đã được gửi.");
          this.spinner.hide().then();
        },
        error: err => {
          this.isMessageError = true;
          this.messageError = "Tài khoản không tồn tại!";
          this.spinner.hide().then();
        }
      });
    } else {
      Object.values(this.formUsername.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.spinner.hide().then();
    }
  }

  verifyFormSubmit(): void {
    if (this.formCodeConfirm.valid) {
      const verifyCode = this.formCodeConfirm.value['code'];
      this.http.post(API_CONFIG.BASE_URL + `auth/getForgotCode/${verifyCode}`, null).subscribe({
        next: res => {
          this.isTabTwo = false;
          this.isTabThree = true;
          this.isMessageErrorTwo = false;
        },
        error: err => {
          this.isMessageError = false;
          this.isMessageErrorTwo = true;
          this.messageErrorTwo = "Sai mã xác nhận, vui lòng nhập lại!";
        }
      });
    } else {
      Object.values(this.formCodeConfirm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  verifyFormChangePasswordSubmit(): void {
    if (this.formChangePasswordConfirm.valid) {
      this.registerFormData.account = this.formChangePasswordConfirm.value['account'];
      this.registerFormData.password = this.formChangePasswordConfirm.value['password'];
      this.registerFormData.confirmPassword = this.formChangePasswordConfirm.value['confirmPassword'];

      if (this.registerFormData.password !== this.registerFormData.confirmPassword) {
        this.isMessageErrorThree = true;
        this.messageErrorThree = "Mật khẩu xác nhận không khớp!";
        return;
      }

      this.spinner.show().then();
      this.http.post(API_CONFIG.BASE_URL + 'auth/change-password', this.registerFormData).subscribe({
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
