import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {QualificationService} from "../../../../service/qualification.service";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {
  DetailQualificationManagerComponent
} from "../../qualification/detail-qualification-manager/detail-qualification-manager.component";
import {ContractService} from "../../../../service/contract.service";
import {FileManagerService} from "../../../../service/file-manager.service";
import {FormContractForEmployeeComponent} from "../form-contract-for-employee/form-contract-for-employee.component";

@Component({
  selector: 'app-list-contract-for-employee',
  templateUrl: './list-contract-for-employee.component.html',
  styleUrls: ['./list-contract-for-employee.component.less']
})
export class ListContractForEmployeeComponent implements OnInit {

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
  lstContractType = [
    {id: 0, name: "Hợp đồng thử việc"},
    {id: 1, name: "Hợp đồng chính thức"},
    {id: 2, name: "Hợp đồng thời vụ"},
    {id: 3, name: "Hợp đồng làm theo giờ"},
    {id: 4, name: "Hợp đồng lao động tự do"},
  ]
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  isLoading = false;
  message: string = '';
  idUserDetailContract: any;
  idUserDetail: any;

  @Input() isVisableButton = true;


  constructor(
    private qualificationService: QualificationService,
    private contractService: ContractService,
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
    this.contractService.searchForEmployee(queryModel, pageable).subscribe(res => {
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
      nzTitle: 'Thêm mới hợp đồng cho nhân viên',
      nzContent: FormContractForEmployeeComponent,
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
      nzTitle: 'Cập nhật hợp đồng cho nhân viên',
      nzContent: FormContractForEmployeeComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        idUserContractForm : data.userDetailContractId,
        contractTypeForm: data.contractId,
        activeDateForm: data.activeDate,
        expiredDateForm: data.expiredDate,
        signDateForm: data.signDate,
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
      this.idUserDetailContract = item.userDetailContractId;
      this.message = `Bạn có chắc chắn muốn xóa hợp đồng mã <b>${this.idUserDetailContract}</b> không?`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    // this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.contractService.deleteForEmployee(this.idUserDetailContract).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa hợp đồng của nhân viên thành công');
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
    this.contractService.downLoadFile(attachFile).subscribe(res => {
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
