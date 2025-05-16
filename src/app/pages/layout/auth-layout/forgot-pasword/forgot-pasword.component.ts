import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../service/auth.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-forgot-pasword',
  templateUrl: './forgot-pasword.component.html',
  styleUrls: ['./forgot-pasword.component.less']
})
export class ForgotPaswordComponent implements OnInit {

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
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    private notification: NzNotificationService
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
      this.auth.sendOTP(account).subscribe({
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
      const code = this.formCodeConfirm.value['code'];
      this.auth.verifyForm(code).subscribe({
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
      this.auth.forgotPassword(this.registerFormData).subscribe({
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
