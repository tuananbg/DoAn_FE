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

  lstDepartment: any[] = [];
  lstPosition: any[] = [];
  idUserDetail: any;
  lstGender = [{id: 1, gender: 'Nam'}, {id: 0, gender: 'Nữ'}];
  payloadDepartment = {name: null, status: null};
  payloadPosition = {positionCode: null, positionName: null, isActive: 1};
  payloadAccount = {fullName: null, email: null, status: null, active: null};
  newUser = {
    code: '',
    fullName: '',
    departmentCode: '',
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
    this.fetchDepartments();
    this.fetchPositions();
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

  genderList = [
    { label: 'Nam', value: 1 },
    { label: 'Nữ', value: 0 }
  ];
  lstDepartments: any[] = [];
  lstPositions: any[] = [];

  fetchDepartments() {
    this.departmentService.getListDepartment({}).subscribe(
      (res) => {
        if (res && res.code === "OK") {
          this.lstDepartments = res.data || [];
        }
      },
      (error) => console.error("Lỗi lấy danh sách phòng ban:", error)
    );
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
