import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DepartmentService} from "../../../../service/department.service";
import {PositionService} from "../../../../service/position.service";
import DevExpress from "devextreme";
import EditorStyle = DevExpress.common.EditorStyle;
import {LabelMode} from "devextreme/common";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../../../service/account.service";

export function getSizeQualifier(width: number) {
  if (width <= 420) return 'xs';
  if (width <= 992) return 'sm';
  if (width < 1200) return 'md';
  return 'lg';
}

@Component({
  selector: 'app-form-employee-managerment',
  templateUrl: './form-employee-managerment.component.html',
  styleUrls: ['./form-employee-managerment.component.less']
})
export class FormEmployeeManagermentComponent implements OnInit {

  lstDepartment: any[] = [];
  lstAccount: any[] = [];
  lstPosition: any[] = [];
  idUserDetail: any;
  lstGender = [{id: 1, gender: 'Nam'}, {id: 0, gender: 'Nữ'}];
  payloadDepartment = {name: null, status: null};
  payloadPosition = {positionCode: null, positionName: null, isActive: 1};
  payloadAccount = {fullName: null, email: null, status: null, active: null};
  newUser = {
    employeeCode: '',
    employeeName: '',
    positionId: '',
    departmentId: '',
    birthday: new Date(),
    phone: '',
    email: '',
    address: '',
    gender: ''
  }
  avatarFile!: File;
  stylingMode: EditorStyle = 'outlined';

  getSizeQualifier = getSizeQualifier;
  getNewContactData = () => ({...this.newUser})

  @Input() genderCode: any;

  constructor(
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private accountService:AccountService,
  ) {
  }
  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  ngOnInit(): void {
    // const token = localStorage.getItem('token');
    // const payloadToken: any = token ? this.parseJwt(token) : null;
    // const userObject = JSON.parse(payloadToken.user);
    // this.idUserDetail = userObject.userDetailId;
    //
    //   this.fetchAccount(this.idUserDetail);
    // this.fetchPosition();
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   const {userId} = changes;
  //   if (typeof userId.currentValue === 'number' && userId?.currentValue) {
  //     if( this.idUserDetail === userId.currentValue){
  //       this.isUserOffice = true;
  //     }else{
  //       this.isUserOffice = false;
  //     }
  //     this.fetchAccount(userId.currentValue);
  //   }
  // }

  valueChanged(e : any) {
    if(e.value!=null){
      this.newUser.birthday = e.value;
    }else{
      this.newUser.birthday = new Date();
    }
  }

  onValueChanged(e: any) {
    const files: File[] = e.value;
    if (files.length > 0) {
      this.avatarFile = files[0];
    }
  }

  // fetchDepartment() {
  //   this.departmentService.searchDepartment(this.payloadDepartment, {page: 0, size: -1}).subscribe((response: any) => {
  //     if (response && response.code === "OK") {
  //       this.lstDepartment = response.data.content;
  //       this.lstDepartment.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
  //     }
  //   });
  // }
  //
  // fetchAccount = (id: number) => {
  //   this.accountService.getRole(id).subscribe((response: any) => {
  //     if (response) {
  //       this.lstAccount = response.dataList;
  //       this.lstAccount.sort((a, b) => a.email.localeCompare(b.email));
  //     }
  //   });
  // }

  onDepartmentChanged(event: any) {
    const selectedDepartmentId = event.value;
    this.positionService.searchPosition(this.payloadPosition, {page: 0, size: 10}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstPosition = response.data.data;
        this.lstPosition = this.lstPosition.filter(position => position.departmentId === selectedDepartmentId);
        this.lstPosition.sort((a, b) => a.positionName.localeCompare(b.positionName));
      }
    });
  }
}
