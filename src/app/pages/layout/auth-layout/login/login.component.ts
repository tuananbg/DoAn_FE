import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../../service/login.service";
import {AuthService} from "../../../../service/auth.service";
import {ToastService} from "../../../../service/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  isMeassgeError = false;
  meassgeError = '';
  @Output() submitEM = new EventEmitter();
  password: string = '';
  hidePassword: boolean = true;


  form: FormGroup = new FormGroup({
    account: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  constructor(
      private loginS: LoginService,
      private auth: AuthService,
      private toastService: ToastService,
      private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.auth.loginAccount(this.form.getRawValue()).subscribe(res => {
      console.log(this.form.getRawValue())
      if (res.code !== "OK" || !res.data || !res.data.token) {
        console.log("click")
        this.isMeassgeError = true;
        this.toastService.openErrorToast(res?.msgCode || 'Đã xảy ra lỗi!');
        return;
      }
      console.log(res.data)
      const { token, fullName, employeeCode, roles, email } = res.data;

      this.loginS.setSession({token, fullName, employeeCode, roles, email});

      this.router.navigate(['/dashboard']).then();
    }, (error) => {
      this.isMeassgeError = true;
      this.meassgeError = "Email hoặc mật khẩu không đúng!";
    });
  }


  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


}
