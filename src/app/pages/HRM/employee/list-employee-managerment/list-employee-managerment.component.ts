import {Component, OnInit, ViewChild} from '@angular/core';
import {DxDataGridComponent} from "devextreme-angular";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import {FormEmployeeManagermentComponent} from "../form-employee-managerment/form-employee-managerment.component";
import {Contact, ContactStatus} from "../../../../core/contact";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {EmployeeService} from "../../../../service/employee.service";
import {FileManagerService} from "../../../../service/file-manager.service";
import * as moment from "moment/moment";


type FilterContactStatus = ContactStatus | 'All';

@Component({
  selector: 'app-list-employee-managerment',
  templateUrl: './list-employee-managerment.component.html',
  styleUrls: ['./list-employee-managerment.component.less']
})
export class ListEmployeeManagermentComponent implements OnInit {

  @ViewChild(DxDataGridComponent, {static: true}) dataGrid!: DxDataGridComponent;

  @ViewChild(FormEmployeeManagermentComponent, {static: false}) contactNewForm!: FormEmployeeManagermentComponent;

  // dataSource!: DataSource<Contact[], string>;
  isPanelOpened = false;
  searchForm!: FormGroup;
  isAddContactPopupOpened = false;

  employeeCode: string | null = null;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    // sort: 'CREATED_DATE/DESC', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  genderCodeFromList: any;

  constructor(
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private fileManagerService: FileManagerService
  ) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.maxLength(100)]),
      status: new FormControl(null),
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const pageable = {
      page: currentPage,
      size: pageSize,
    };

    this.spinner.show().then();
    console.log("Search Keyword:", this.searchKeyword);

    this.employeeService.searchEmployee(this.searchKeyword, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        // Sửa cách lấy danh sách nhân viên
        this.lstData = res.data.content || [];  // Lấy từ res.data.content
        this.total = res.data.totalElements || 0;

        this.spinner.hide().then();

        // Kiểm tra nếu không có dữ liệu và trang hiện tại > 0 thì giảm trang
        if (this.lstData.length === 0 && this.request.currentPage !== 0) {
          this.request.currentPage = this.request.currentPage - 1;
          this.fetchData(this.request.currentPage, this.request.pageSize);
        }
      } else {
        this.toastService.openErrorToast(res.message || "Lỗi không xác định");
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast(error.error?.msgCode || "Lỗi kết nối");
      this.spinner.hide().then();
    }, () => {
      this.spinner.hide().then();
    });
  }



  addContact() {
    this.isAddContactPopupOpened = true;
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const genderCode = year + month + day + hours + minutes;
    this.contactNewForm.newUser = {
      employeeCode: 'NV'+genderCode,
      employeeName: '',
      positionId: '',
      departmentId: '',
      birthday: new Date(),
      phone: '',
      email: '',
      address: '',
      gender: ''
    };
  };

  refresh = () => {
    this.fetchData();
    this.dataGrid.instance.refresh();
  };

  rowClick(e: DxDataGridTypes.RowClickEvent) {
    console.log("Dữ liệu hàng:", e.data); // Kiểm tra dữ liệu dòng khi click
    const newEmployeeCode = e.data?.employeeCode;

    if (!newEmployeeCode) {
      console.warn("Không tìm thấy mã nhân viên!");
      return;
    }

    if (newEmployeeCode !== this.employeeCode) {
      console.log(`Cập nhật employeeCode: ${this.employeeCode} => ${newEmployeeCode}`);
      this.employeeCode = newEmployeeCode;
    } else {
      console.log("Nhấn vào cùng một nhân viên, không cập nhật.");
    }

    this.isPanelOpened = true;
  }


  onOpenedChange = (value: boolean) => {
    if (!value) {
      this.employeeCode == null;
    }
  };

  onPinnedChange = () => {
    this.dataGrid.instance.updateDimensions();
  };


  async onExporting(e: any) {
    if (this.searchForm.invalid) return;
    const queryModel = null;
    const pageable = {
      sort: this.request.sort
    };
    await this.fetchData(this.request.currentPage, this.request.pageSize);
    this.spinner.show().then();
    if(this.lstData.length===0){
      return;
    }
    this.employeeService.exportEmployee(queryModel, pageable).subscribe(async response => {
      const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
      const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
      if (typeof responseData === "string") {
        const responseJson = JSON.parse(responseData);
        this.toastService.openErrorToast(responseJson.msgCode);
      } else {
        const currentDate = moment(new Date()).format('DDMMYYYY');
        this.fileManagerService.downloadFile(response, 'danhsachnhanvien_' + currentDate + '.xlsx');
      }
    }, error => {
      this.toastService.openErrorToast(error);
    }, () => {
      this.spinner.hide().then();
    });
    e.cancel = true;
  }

  handleOkModal() {
    if (this.contactNewForm.getNewContactData()) {
      const data = this.contactNewForm.getNewContactData();
      const avatarFile = this.contactNewForm.avatarFile;
      this.spinner.show().then();
      this.employeeService.createEmployee(avatarFile, data).subscribe(res => {
        if (res && res.body.code === "OK") {
          this.toastService.openSuccessToast('Thêm mới nhân viên thành công');
          this.contactNewForm.newUser = {
            employeeCode: '',
            employeeName: '',
            positionId: '',
            departmentId: '',
            birthday: new Date(),
            phone: '',
            email: '',
            address: '',
            gender: ''
          };
          this.fetchData(this.request.currentPage, this.request.pageSize);
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
          this.spinner.hide().then();
        }
      }, error => {
        this.toastService.openErrorToast(error.error.msgCode);
        this.spinner.hide().then();
      }, () => {
        this.spinner.hide().then();
      });
    }
  }


}
