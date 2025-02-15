import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {QualificationService} from "../../../../service/qualification.service";
import {ToastService} from "../../../../service/toast.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {SocialinsuranceService} from "../../../../service/socialinsurance.service";
import {
  FormSocialinsuranceManagermentComponent
} from "../form-socialinsurance-managerment/form-socialinsurance-managerment.component";

@Component({
  selector: 'app-list-socialinsurance-managerment',
  templateUrl: './list-socialinsurance-managerment.component.html',
  styleUrls: ['./list-socialinsurance-managerment.component.less']
})
export class ListSocialinsuranceManagermentComponent implements OnInit {

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
  idSocialinsurance: any;

  @Input() isVisableButton = true;
  constructor(
    private socialinsuranceService: SocialinsuranceService,
    private toastService: ToastService,
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private viewContainerRef: ViewContainerRef,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.idSocialinsurance = this.activatedRoute.snapshot.params['id'];
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number){
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.socialinsuranceService.search(this.idSocialinsurance, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.content;
        this.total = res.data.totalElements;
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
      nzTitle: 'Thêm mới thông tin bảo hiểm',
      nzContent: FormSocialinsuranceManagermentComponent,
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
      nzTitle: 'Cập nhật thông tin bảo hiểm',
      nzContent: FormSocialinsuranceManagermentComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        idSocialInsuranceForm: data.socialInsuranceId,
        socialInsuranceCodeForm: data.socialInsuranceCode,
        initialPaymentForm: data.initialPayment,
        percentForm: data.percent,
        actualPaymentForm: data.actualPayment,
        licenseDateForm: data.licenseDate,
        expiredDateForm: data.expiredDate,
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
      this.idSocialinsurance = item.socialInsuranceId;
      this.message = `<span>Bạn có chắc chắn muốn xóa thông tin bảo hiểm <b>${this.idSocialinsurance}</b> không?</span>`
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
  }

  callBackModalDelete() {
    this.socialinsuranceService.delete(this.idSocialinsurance).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa thông tin bảo hiểm thành công');
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

}
