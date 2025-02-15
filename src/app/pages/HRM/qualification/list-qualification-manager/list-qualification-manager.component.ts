import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
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
import {QualificationService} from "../../../../service/qualification.service";
import {ActivatedRoute} from "@angular/router";
import {
  DetailQualificationManagerComponent
} from "../detail-qualification-manager/detail-qualification-manager.component";

@Component({
  selector: 'app-list-qualification-manager',
  templateUrl: './list-qualification-manager.component.html',
  styleUrls: ['./list-qualification-manager.component.less']
})
export class ListQualificationManagerComponent implements OnInit {

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
  lstStatus = [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"}
  ]
  SCROLL_TABLE = {
    SCROLL_X: '1000px',
    SCROLL_Y: '60vh'
  }
  isVisibleModalDelete = false;
  department: any;
  departmentCode: any;
  isLoading = false;
  message = '';
  idQualification: any;
  idUserDetail: any;

  @Input() isVisableButton = true;

  constructor(
    private qualificationService: QualificationService,
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
    this.spinner.show().then();
    this.qualificationService.search(this.idUserDetail, pageable).subscribe(res => {
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
      nzTitle: 'Thêm mới bằng cấp chứng chỉ',
      nzContent: DetailQualificationManagerComponent,
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
      nzTitle: 'Cập nhật bằng cấp chứng chỉ',
      nzContent: DetailQualificationManagerComponent,
      nzWidth: '700px',
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        isUpdate: true,
        idQualificationForm : data.id,
        levelForm: data.level,
        nameForm: data.name,
        majorForm: data.major,
        descriptionForm: data.description,
        licenseDateForm: data.licenseDate,
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
      this.idQualification = item.id;
      // this.message = `<span>Bạn có chắc chắn muốn xóa bằng cấp mã <b>${this.idQualification}</b> không?</span>`
      this.message = 'Bạn có chắc chắn muốn xóa bằng cấp có mã <b>' + item.id + '</b> không?'

    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
    // this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  callBackModalDelete() {
    this.qualificationService.delete(this.idQualification).subscribe(res => {
      if (res && res.code === "OK") {
        const data = res.data;
        this.toastService.openSuccessToast('Xóa bằng cấp thành công');
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
