import { Component, Input, OnInit } from '@angular/core';
import { PositionService } from "../../../../service/position.service";
import { getSizeQualifier } from "../../../../service/screen.service";
import DevExpress from "devextreme";
import EditorStyle = DevExpress.common.EditorStyle;

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
  @Input() isCreateMode: boolean = false;
  // Biến chính dùng cho binding form
  @Input() newUser: any = {
    id: '',
    code: '',
    fullName: '',
    positionCode: '',
    dateOfBirth: new Date(),
    gender: '',
    placeOfBirth: '',
    taxCode: '',
    // insuranceNumber: '',
    accountNumber: '',
    permanentAddress: '',
    currentAddress: '',
    identityNumber: '',
    phone: '',
    nation: ''
  };

  avatarFile!: File;
  stylingMode: EditorStyle = 'outlined';
  getSizeQualifier = getSizeQualifier;

  constructor(
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.fetchPositions();

    // Nếu chỉnh sửa → ép kiểu ngày
    if (this.newUser?.dateOfBirth) {
      this.newUser.dateOfBirth = new Date(this.newUser.dateOfBirth);
    }
  }

  getNewContactData = () => {
    return {
      id: this.newUser.id,
      code: this.newUser.code,
      fullName: this.newUser.fullName,
      positionCode: this.newUser.positionCode,
      dateOfBirth: this.formatDate(this.newUser.dateOfBirth),
      gender: this.newUser.gender,
      placeOfBirth: this.newUser.placeOfBirth,
      taxCode: this.newUser.taxCode,
      insuranceNumber: this.newUser.insuranceNumber,
      accountNumber: this.newUser.accountNumber,
      permanentAddress: this.newUser.permanentAddress,
      currentAddress: this.newUser.currentAddress,
      identityNumber: this.newUser.identityNumber,
      mobile: this.newUser.mobile,
    };
  }

  onValueChanged(e: any) {
    const files: File[] = e.value;
    if (files.length > 0) {
      this.avatarFile = files[0];
    }
  }

  valueChanged(e: any) {
    if (e.value != null) {
      this.newUser.dateOfBirth = e.value;
    } else {
      this.newUser.dateOfBirth = new Date();
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ''; // Kiểm tra ngày hợp lệ
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
