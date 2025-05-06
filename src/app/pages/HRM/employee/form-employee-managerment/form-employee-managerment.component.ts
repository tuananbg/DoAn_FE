import {Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PositionService } from "../../../../service/position.service";
import { DepartmentService } from "../../../../service/department.service";
import {getSizeQualifier} from "../../../../service/screen.service";
import DevExpress from "devextreme";
import EditorStyle = DevExpress.common.EditorStyle;
import {EmployeeService} from "../../../../service/employee.service";
import {AccountService} from "../../../../service/account.service";

@Component({
  selector: 'app-form-employee-managerment',
  templateUrl: './form-employee-managerment.component.html',
  styleUrls: ['./form-employee-managerment.component.less']
})
export class FormEmployeeManagermentComponent implements OnInit {

  genderList = [
    { label: 'Nam', value: 1 },
    { label: 'Nữ', value: 0 }
  ];
  lstDepartments: any[] = [];
  lstPositions: any[] = [];
  newUser = {
    code: '',
    fullName: '',
    positionCode:'',
    dateOfBirth: new Date(),
    gender: '',
    placeOfBirth: '',
    taxCode: '',
    insuranceNumber: '',
    accountNumber: '',
    permanentAddress: '',
    currentAddress: '',
    identityNumber: '',
    mobile: '',
    nation: ''
  }
  avatarFile!: File;
  stylingMode: EditorStyle = 'outlined';
  getSizeQualifier = getSizeQualifier;
  getNewContactData = () => ({...this.newUser})

  @Input() genderCode: any;

  constructor(
    private positionService: PositionService,
  ) {
  }

  ngOnInit(): void {
    this.fetchPositions();
  }

  valueChanged(e : any) {
    if(e.value!=null){
      this.newUser.dateOfBirth = e.value;
    }else{
      this.newUser.dateOfBirth = new Date();
    }
  }

  onValueChanged(e: any) {
    const files: File[] = e.value;
    if (files.length > 0) {
      this.avatarFile = files[0];
    }
  }

  fetchPositions() {
    this.positionService.getSelection().subscribe(
      (res) => {
        if (res && res.code === "200") {
          this.lstPositions = res.data || [];
        }
      },
      (error) => console.error("Lỗi lấy danh sách chức vụ:", error)
    );
  }


}
