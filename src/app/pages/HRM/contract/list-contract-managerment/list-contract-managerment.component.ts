import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PositionService} from "../../../../service/position.service";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import {
  PositionManagermentFormComponent
} from "../../position/position-managerment-form/position-managerment-form.component";
import * as moment from "moment/moment";
import {ContractService} from "../../../../service/contract.service";
import {FormContractManagermentComponent} from "../form-contract-managerment/form-contract-managerment.component";

@Component({
  selector: 'app-list-contract-managerment',
  templateUrl: './list-contract-managerment.component.html',
  styleUrls: ['./list-contract-managerment.component.less']
})
export class ListContractManagermentComponent implements OnInit {

  isActive = true;
  searchForm!: FormGroup;
  searchFormValue: any;
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
  department: any;
  departmentCode: any;
  isLoading = false;
  message: string = '';
  idContract: any;


  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private fileManagerService: FileManagerService,
  ) {

  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      contractCode: new FormControl(null, [Validators.maxLength(100)]),
      contractType: new FormControl(null)
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number){
    const formValue = this.searchForm.value;
    const queryModel = {
      contractCode: !formValue.contractCode ? null : formValue.contractCode.toString(),
      contractType: !formValue.contractType ? null : formValue.contractType.toString()
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.contractService.search(queryModel, pageable).subscribe(res => {
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

  resetForm() {
    this.searchForm.reset();
    this.searchForm.patchValue({
      name: null,
      isActive: null,
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới loại hợp đồng',
      nzContent: FormContractManagermentComponent,
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
      nzTitle: 'Cập nhật hợp đồng',
      nzContent: FormContractManagermentComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        idContractForm : data.contractId,
        contractCodeForm: data.contractCode,
        contractTypeForm: data.contractType,
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
      this.idContract = item.contractId;
      this.message = `<span>Bạn có chắc chắn muốn xóa hợp đồng mã <b>${this.idContract}</b> không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.contractService.delete(this.idContract).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa hợp đồng thành công');
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
