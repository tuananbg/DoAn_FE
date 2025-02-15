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
  validateForm!: FormGroup;
  companyInfoForm!: FormGroup;
  verifyForm!: FormGroup
  employeeForm!: FormGroup
  registerFormData: RegisterData = {
    username: '',
    email: '',
    password: '',
    company: {
      companyViName: '',
      companyEnName: '',
      legalType: '',
      taxCode: '',
      address: '',
      foundingDate: '',
      representative: '',
      website: '',
      phone: ''
    }
  }
  lstEmployee: any[] = [];
  lstAccount: any[] = [];
  payloadAccount = {fullName: null, email: null, status: null, active: null};
  payloadEmployee = {employeeCode: null, employeeName: null, employeeEmail: null, employeeGender: null, positionId: null, departmentId: null};

  constructor(private fb: FormBuilder, private http: HttpClient,
              private notification: NzNotificationService,
              private employeeService: EmployeeService,
              private accountService:AccountService,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
    this.companyInfoForm = this.fb.group({
      companyViName: [null, [Validators.required]],
      companyEnName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      taxCode: [null, [Validators.required]],
      legalType: [null, [Validators.required]],
      representative: [null, [Validators.required]],
      foundingDate: [null, [Validators.required]],
      phone: [null],
      website: [null]
    })
    this.verifyForm = this.fb.group({
      verifyCode: [null, [Validators.required]]
    })
    this.employeeForm = this.fb.group({
      id: [null, [Validators.required]],
      userDetailId: [null, [Validators.required]]
    })
    this.fetchEmployee();
    this.fetchAccount();
  }
  validationFormSubmit(): void {
    if (this.validateForm.valid) {
      this.registerFormData.email = this.validateForm.value['email']
      this.registerFormData.password = this.validateForm.value['password']
      console.log(this.registerFormData)
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    this.http.post('http://localhost:8080/api/v1/auth/register', this.registerFormData).subscribe({
      next: res=> {
        this.notification.success("Thành công", "Đăng ký tài khoản thành công")
        this.current++;
      },
      error: err => {
        this.notification.error("Thất bại", err.error.msgCode)
        console.log(err)
      }
    })
  }
  companyInfoFormSubmit(): void {
    if (this.companyInfoForm.valid) {
      this.registerFormData.company.companyViName = this.companyInfoForm.value['companyViName']
      this.registerFormData.company.companyEnName = this.companyInfoForm.value['companyEnName']
      this.registerFormData.company.legalType = this.companyInfoForm.value['legalType']
      this.registerFormData.company.taxCode = this.companyInfoForm.value['taxCode']
      this.registerFormData.company.address = this.companyInfoForm.value['address']
      this.registerFormData.company.foundingDate = this.companyInfoForm.value['foundingDate']
      this.registerFormData.company.representative = this.companyInfoForm.value['representative']
      this.registerFormData.company.website = this.companyInfoForm.value['website']
      this.registerFormData.company.phone = this.companyInfoForm.value['phone']
      console.log('registerFormData', this.registerFormData);
      this.http.post('http://localhost:8080/api/v1/auth/register', this.registerFormData).subscribe({
        next: res=> {
          this.notification.success("Thành công", "Kích hoạt tài khoản thành công")
          this.current++
        },
        error: err => {
          this.notification.error("Thất bại", err)
          console.log(err)
        }
      })

    } else {
      Object.values(this.companyInfoForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  verifyFormSubmit(): void {
    if (this.verifyForm.valid) {
      console.log('submit', this.verifyForm.value);
      const verifyCode = this.verifyForm.value['verifyCode']
      this.http.get(`http://localhost:8080/api/v1/auth/${verifyCode}`).subscribe({
        next: res=> {
          console.log(res)
          this.notification.success("Thành công", "Kích hoạt tài khoản thành công");
          this.fetchAccount();
          this.current++;
        },
        error: err => {
          console.log(err)
        }
      })
    } else {
      Object.values(this.verifyForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  employeeFormSubmit(): void {
    if (this.employeeForm.valid) {
      this.spinner.show().then();
      const data = this.employeeForm.value;
      data.id = !data.id ? null : data.id;
      data.userDetailId = !data.userDetailId ? null : data.userDetailId;
      this.accountService.editAccount(data).subscribe(res => {
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
      Object.values(this.verifyForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };


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

  fetchAccount() {
    this.accountService.getAllAccount(this.payloadAccount, 0, -1).subscribe((response: any) => {
      if (response) {
        this.lstAccount = response.dataList;
        this.lstAccount.sort((a, b) => a.email.localeCompare(b.email));
      }
    });
  }

  onChangeCurrent(){
    this.current = 2;
  }
  onChangeCurrentOne(){
    this.current = 0;
  }
}
