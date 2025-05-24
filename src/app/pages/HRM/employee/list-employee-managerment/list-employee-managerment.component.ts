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
import {Router} from "@angular/router";


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
  isLoading = false;
  currentTabIndex = 0;
  statusList = ['EMPLOYMENT', 'WAITING_FOR_SIGNING','WAITING_FOR_ONBOARD','RETIRED'];

  employeeCode: string | null = null;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'CREATED_DATE/DESC', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  genderCodeFromList: any;

  constructor(
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private fileManagerService: FileManagerService,
    private router: Router
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

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const pageable = {
      page: currentPage,
      size: pageSize,
    };
    const status = this.statusList[this.currentTabIndex];

    this.spinner.show().then();
    console.log("Search Keyword:", this.searchKeyword);

    this.employeeService.getList(this.searchKeyword, status, pageable).subscribe(res => {
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


    // Cập nhật dữ liệu cho form nhân viên mới
    this.contactNewForm.newUser = {
      code: '',
      fullName: '',
      positionCode: '',
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
    };
    this.contactNewForm.isCreateMode = true;
  }

  refresh = () => {
    this.fetchData();
    this.dataGrid.instance.refresh();
  };

  rowClick(e: DxDataGridTypes.RowClickEvent) {
    const newEmployeeCode = e.data?.employeeCode;

    if (!newEmployeeCode) {
      console.warn("Không tìm thấy mã nhân viên!");
      return;
    }

    if (newEmployeeCode !== this.employeeCode) {
      this.employeeCode = newEmployeeCode;
    }

    this.router.navigate(['infor-employee/', newEmployeeCode]);
  }


  async onExporting(e: any) {
    const status = this.statusList[this.currentTabIndex];
    this.employeeService.exportEmployee(status).subscribe({
      next: async (response) => {
        try {
          await this.fileManagerService.downloadBlobResponse(response, 'bang_thong_ke_cham_cong.xlsx');
        } catch (err: any) {
          this.toastService.openErrorToast(err.msgCode || 'Không có dữ liệu phù hợp để tải xuống.');
          this.spinner.hide().then();
        }
      },
      error: (error) => {
        this.toastService.openErrorToast(error?.msgCode || 'Lỗi kết nối máy chủ');
        this.spinner.hide().then();
      },
      complete: () => {
        this.spinner.hide().then();
      }
    });
    e.cancel = true;
  }

  handleOkModal() {
    if (this.contactNewForm.getNewContactData()) {
      const data = this.contactNewForm.getNewContactData();
      if (data.dateOfBirth && isNaN(new Date(data.dateOfBirth).getTime())) {
        console.log(data.dateOfBirth);
        this.toastService.openErrorToast("Ngày sinh không hợp lệ");
        return;
      }
      const avatarFile = this.contactNewForm.avatarFile;
      this.spinner.show().then();
      this.employeeService.createEmployee(avatarFile, data).subscribe(res => {
        if (res && res.body?.code === "201") {
          this.toastService.openSuccessToast(res.body?.message || 'Thêm mới nhân viên thành công');
          this.contactNewForm.newUser = {
            code: '',
            fullName: '',
            positionCode: '',
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
          };

          // Cập nhật danh sách
          this.fetchData(this.request.currentPage, this.request.pageSize);
        } else {
          this.toastService.openErrorToast(res.body?.msgCode || "Lỗi không xác định");
        }
        this.spinner.hide().then();
      }, error => {
        this.toastService.openErrorToast(error.error?.msgCode || "Lỗi kết nối");
        this.spinner.hide().then();
      });
    }
  }

}
