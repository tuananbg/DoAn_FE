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
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";

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
  searchFormValue: any;

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
    private fileManagerService: FileManagerService,
    private i18n: NzI18nService,
  ) {}

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.searchForm = this.formBuilder.group({
      keyword: new FormControl(null, [Validators.maxLength(100)]),
    });
    if (this.searchFormValue) {
      this.searchForm.patchValue(this.searchFormValue);
    }

    this.searchForm.get('keyword')?.valueChanges
      .pipe(
        debounceTime(500),               // đợi 500ms sau khi người dùng dừng gõ
        distinctUntilChanged()           // chỉ gọi nếu giá trị thực sự thay đổi
      )
      .subscribe(value => {
        this.onSearchChanged(value);
      });

    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number): void {
    const formValue = this.searchForm.value;
    const status = this.statusList[this.currentTabIndex];

    const queryModel = {
      keyword: formValue.keyword ?? "",
    };

    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort
    };

    const finalParams = { ...pageable, ...queryModel };

    this.spinner.show().then();
    this.contractService.getList(status, finalParams).subscribe(
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

        this.spinner.hide().then();
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

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }
}
