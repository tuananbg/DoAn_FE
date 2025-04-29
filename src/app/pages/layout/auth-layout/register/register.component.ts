import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {RegisterData} from "./types/register";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";
import {EmployeeService} from "../../../../service/employee.service";
import {AccountService} from "../../../../service/account.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../service/toast.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  current: number = 0;
  isView = false;
  listOfOption: string[] = [];
  verifyForm!: FormGroup
  employeeForm!: FormGroup
  lstEmployee: any[] = [];
  lstAccount: any[] = [];
  constructor(private fb: FormBuilder, private http: HttpClient,
              private notification: NzNotificationService,
              private employeeService: EmployeeService,
              private accountService:AccountService,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      employeeCode: [null, [Validators.required]]
    })
    this.fetchEmployee();
  }

  employeeFormSubmit(): void {
    console.log("Data",this.employeeForm.value);
    if (this.employeeForm.valid) {
      this.spinner.show().then();
      const data = this.employeeForm.value;
      data.email = !data.email ? null : data.email;
      data.employeeCode = !data.employeeCode ? null : data.employeeCode;
      this.accountService.createAccount(data).subscribe(res => {
        if (res && res.code === "OK") {
          this.toastService.openSuccessToast("Cấp tài khoản thành công");
          setTimeout(()=>{
            this.router.navigate(["/account"]);
          }, 3000);
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
      }, error => {
        this.toastService.openErrorToast(error.error.msgCode);
      }, () => {
        this.spinner.hide().then();
      });
    } else {
      Object.values(this.employeeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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

}
