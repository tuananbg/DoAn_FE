import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FileManagerService} from "../../../../service/file-manager.service";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import { WageService } from 'src/app/service/wage.service';
import {FormWageForEmployeeComponent} from "../form-wage-for-employee/form-wage-for-employee.component";

@Component({
  selector: 'app-list-wage-for-employee',
  templateUrl: './list-wage-for-employee.component.html',
  styleUrls: ['./list-wage-for-employee.component.less']
})
export class ListWageForEmployeeComponent implements OnInit {

  isActive = true;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'createdDate/desc', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  isLoading = false;
  message: string = '';
  idUserDetailWage: any;
  allowanceCode: any;

  @Input() isVisableButton = true;
  @Input() employeeCode!: string;

  constructor(
    private wageService: WageService,
    private fileManagerService: FileManagerService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number): void {
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };

    this.spinner.show().then();
    this.wageService.searchForEmployee(this.employeeCode, pageable).subscribe(
      res => {
        if (res && res.code === "OK") {
          const pageData = res.data || {};
          const content = pageData.content || [];

          this.lstData = content.map((item: any) => ({
            allowanceCode: item.allowanceCode,
            employeeCode: item.employeeCode,
            allowanceName: item.allowanceName,
            allowanceBase: item.allowanceBase,
            allowanceDescription: item.allowanceDescription,
            attachFile: item.attachFile,
          }));

          this.total = pageData.totalElements || 0;

          // Auto back one page if current page empty
          if (this.lstData.length === 0 && this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        } else {
          this.toastService.openErrorToast(res.body?.msgCode || 'Lỗi lấy dữ liệu');
        }
        this.spinner.hide().then();
      },
      error => {
        this.toastService.openErrorToast(error.error?.msgCode || 'Lỗi kết nối');
        this.spinner.hide().then();
      },
      () => {
        this.spinner.hide().then();
      }
    );
  }


  nzOnSearch(): void {
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    console.log("employeeCode1",this.employeeCode);
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới phụ cấp cho nhân viên',
      nzContent: FormWageForEmployeeComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        employeeCode: this.employeeCode
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if(this.isLoading){
        this.nzOnSearch();
      }
    });
  }

  openUpdateModal(data?: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cập nhật phụ cấp cho nhân viên',
      nzContent: FormWageForEmployeeComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        employeeCode: this.employeeCode,
        isUpdate: true,
        allowanceCode: data.allowanceCode,
        id: data.id,
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 3000)),
      nzFooter: null,
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if(this.isLoading){
        this.nzOnSearch();
      }
    });
  }

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.allowanceCode = item.allowanceCode;
      this.message = `Bạn có chắc chắn muốn xóa phụ cấp mã ${this.allowanceCode} không?`;
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    // this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.wageService.deleteForEmployee(this.employeeCode,this.allowanceCode).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa phụ cấp của nhân viên thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
      this.fetchData(this.request.currentPage, this.request.pageSize);
    });
  }

  changeCurrentPage(currentPage: number) {
    this.request.currentPage = currentPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.pageSize = itemPerPage;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  handleClick(attachFile: string) {
    console.log('Attach file:', attachFile);
    this.wageService.downLoadFile(attachFile).subscribe(res => {
      const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/octet-stream';
      const responseData = isJsonBlob(res.body) ? (res.body).text() : res.body || {};
      if (typeof responseData === "string") {
        const responseJson = JSON.parse(responseData);
        this.toastService.openErrorToast(responseJson.msgCode);
      } else {
        this.fileManagerService.downloadFile(res, 'hopdong_' + attachFile);
      }
    }, error => {
      this.toastService.openErrorToast(error);
    }, () => {
      this.spinner.hide().then();
    });
  }


}
