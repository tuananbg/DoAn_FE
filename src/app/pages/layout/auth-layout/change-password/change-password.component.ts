import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../../service/login.service";
import {AuthService} from "../../../../service/auth.service";
import {ToastService} from "../../../../service/toast.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {RegisterData} from "../register/types/register";

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
  password: string = '';
  hidePassword: boolean = true;
  isTabOne = true;
  isTabTwo= false;
  isTabThree= false;
  registerFormData = {
    email: '',
    password: '',
    confirmPassword: ''
  }


  formGmail: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  formCodeConfirm: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  formChangePasswordConfirm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  submit() {
    if (this.formGmail.valid) {
      this.submitEM.emit(this.formGmail.value);
    }
  }

  constructor(
    private loginService: LoginService,
    private auth: AuthService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http:HttpClient,
    private notification: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  verifyFormSubmit(): void {
    if (this.formCodeConfirm.valid) {
      console.log('submit', this.formCodeConfirm.value);
      const verifyCode = this.formCodeConfirm.value['code']
      this.http.post(`http://localhost:8080/api/v1/auth/getForgotCode/${verifyCode}`, null).subscribe({
        next: res=> {
          console.log(res)
          this.isTabOne = false;
          this.isTabTwo = false;
          this.isTabThree = true;
          this.isMessageErrorTwo = false;
        },
        error: err => {
          console.log(err);
          this.isMessageError = false;
          this.isMessageErrorTwo = true;
          this.messageErrorTwo = "Sai mã xác nhận, vui lòng nhập lại!";
        }
      })
    } else {
      Object.values(this.formCodeConfirm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  verifyEmailFormSubmit(): void {
    if (this.formGmail.valid) {
      const email  = this.formGmail.value['email'];
      this.spinner.show().then();
      this.http.get(`http://localhost:8080/api/v1/auth/forgot-password/${email}`).subscribe({
        next: res=> {
          this.isTabOne = false;
          this.isTabTwo = true;
          this.isMessageError = false;
          this.formChangePasswordConfirm.get('email')?.setValue(email);
          this.notification.success("Thành công", "Mã xác thực mới đã được gửi vào email");
          this.spinner.hide().then();
        },
        error: err => {
          this.isMessageError = true;
          this.messageError = "Email không tồn tại!";
          this.spinner.hide().then();
        }
      })
    } else {
      Object.values(this.formGmail.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.spinner.hide().then();
    }
  }

  onChangeTab(){
    this.isTabOne = true;
    this.isTabTwo = false;
    this.isTabThree = false;
  }

  verifyFormChangePasswordSubmit(){
    if (this.formChangePasswordConfirm.valid) {
      this.registerFormData.email = this.formChangePasswordConfirm.value['email']
      this.registerFormData.password = this.formChangePasswordConfirm.value['password']
      this.registerFormData.confirmPassword = this.formChangePasswordConfirm.value['confirmPassword']
      console.log(this.registerFormData)
    } else {
      Object.values(this.formChangePasswordConfirm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    this.spinner.show().then();
    this.http.post('http://localhost:8080/api/v1/auth/change-password', this.registerFormData).subscribe({
      next: res=> {
        this.notification.success("Thành công", "Đổi mật khẩu thành công")
        this.spinner.hide().then();
        this.router.navigate(['/auth/login']).then();
        this.onChangeTab();
      },
      error: err => {
        this.notification.error("Thất bại", err.error.msgCode)
        console.log(err)
        this.spinner.hide().then();
      }
    })
  }


}
