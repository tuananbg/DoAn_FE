import {Component, Input, OnInit} from '@angular/core';
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

  ngOnInit(): void {
    this.fetchDepartment();
    this.fetchAccount();
    // this.fetchPosition();
  }

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

  fetchDepartment() {
    this.departmentService.searchDepartment(this.payloadDepartment, {page: 0, size: -1}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstDepartment = response.data.content;
        this.lstDepartment.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
      }
    });
  }

  fetchAccount() {
    this.accountService.getAllAccount(this.payloadAccount, 0, -1).subscribe((response: any) => {
      if (response) {
        this.lstAccount = response.dataList;
        this.lstAccount.sort((a, b) => a.email.localeCompare(b.email));
      }
    });
  }

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
