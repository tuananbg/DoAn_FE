import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ContractService } from "../../../../service/contract.service";
import { ToastService } from "../../../../service/toast.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { FileManagerService } from "../../../../service/file-manager.service";
import { FormContractManagermentComponent } from "../form-contract-managerment/form-contract-managerment.component";

@Component({
  selector: 'app-list-contract-managerment',
  templateUrl: './list-contract-managerment.component.html',
  styleUrls: ['./list-contract-managerment.component.less']
})
export class ListContractManagermentComponent implements OnInit {
  isActive = true;
  searchForm!: FormGroup;
  request: any = {
    currentPage: 0,
    pageSize: 10,
    sort: ['createdDate/DESC']
  };
  lstData: any[] = [];
  total = 0;
  isVisibleModalDelete = false;
  isLoading = false;
  message = '';
  idContract: any;

  currentTabIndex = 0;
  statusList = ['ACTIVE', 'INACTIVE'];

  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  };

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private toastService: ToastService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private fileManagerService: FileManagerService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      contractCode: new FormControl(null, [Validators.maxLength(100)]),
      contractType: new FormControl(null)
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number): void {
    const formValue = this.searchForm.value;
    const queryModel = {
      contractCode: formValue.contractCode?.toString() ?? null,
      contractType: formValue.contractType?.toString() ?? null
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort
    };
    const status = this.statusList[this.currentTabIndex];

    this.spinner.show().then();
    this.contractService.getList(status, pageable).subscribe(
      (res) => {
        if (res && res.code === "OK") {
          this.lstData = res.data.content || [];
          this.total = res.data.totalElements || 0;

          if (this.lstData.length === 0 && this.request.currentPage !== 0) {
            this.request.currentPage--;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        } else {
          this.toastService.openErrorToast(res.body?.msgCode || 'Lỗi không xác định');
        }

        this.spinner.hide().then(); // ✅ di chuyển ra ngoài if
      },
      (error) => {
        this.toastService.openErrorToast(error.error?.msgCode || 'Có lỗi xảy ra');
        this.spinner.hide().then();
      }
    );
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  nzOnSearch(): void {
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  resetForm(): void {
    this.searchForm.reset();
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới loại hợp đồng',
      nzContent: FormContractManagermentComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzMaskClosable: false
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if (this.isLoading) this.nzOnSearch();
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
        idContractForm: data.contractId,
        contractCodeForm: data.contractCode,
        contractTypeForm: data.contractType
      },
      nzFooter: null,
      nzMaskClosable: false
    });
    modalRef.afterClose.subscribe(rs => {
      this.isLoading = true;
      if (this.isLoading) this.nzOnSearch();
    });
  }

  openModalDelete(item: any): void {
    if (!item.totalEmp) {
      this.isVisibleModalDelete = true;
      this.idContract = item.contractId;
      this.message = `<span>Bạn có chắc chắn muốn xóa hợp đồng mã <b>${this.idContract}</b> không?</span>`;
    }
  }

  onCancelModalDelete(): void {
    this.isVisibleModalDelete = false;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete(): void {
    this.contractService.delete(this.idContract).subscribe((res) => {
      if (res && res.code === "OK") {
        this.toastService.openSuccessToast('Xóa hợp đồng thành công');
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
      this.fetchData(this.request.currentPage, this.request.pageSize);
    });
  }

  changeCurrentPage(currentPage: number): void {
    this.request.currentPage = currentPage;
    this.fetchData(currentPage, this.request.pageSize);
  }

  changeItemPerPage(itemPerPage: number): void {
    this.request.pageSize = itemPerPage;
    this.fetchData(this.request.currentPage, itemPerPage);
  }

  handleClick(attachFile: string): void {
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
