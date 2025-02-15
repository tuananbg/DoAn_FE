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
    sort: 'created_date,desc', // -: desc | +: asc,
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
  idUserDetail: any;

  @Input() isVisableButton = true;

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
    this.idUserDetail = this.activatedRoute.snapshot.params['id'];
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number){
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    const queryModel = {
      userDetailId : this.idUserDetail
    };
    this.spinner.show().then();
    this.wageService.searchForEmployee(queryModel, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.data;
        this.total = res.data.dataCount;
        this.spinner.hide().then();
        if (this.lstData.length === 0) {
          if (this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        }
        this.spinner.hide().then();
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
      this.spinner.hide().then();
    }, () => {
      this.spinner.hide().then();
    });
  }

  nzOnSearch(): void {
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới phụ cấp cho nhân viên',
      nzContent: FormWageForEmployeeComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
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
        isUpdate: true,
        idUserWageForm : data.userDetailWageId,
        wageIdForm: data.wageId,
        licenseDateForm: data.licenseDate,
        empSignForm: data.empSign,
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
      this.idUserDetailWage = item.userDetailWageId;
      this.message = `Bạn có chắc chắn muốn xóa phụ cấp mã <b>${this.idUserDetailWage}</b> không?`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    // this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.wageService.deleteForEmployee(this.idUserDetailWage).subscribe(res => {
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
