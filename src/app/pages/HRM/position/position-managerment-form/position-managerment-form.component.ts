import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {PositionService} from "../../../../service/position.service";
import {DepartmentService} from "../../../../service/department.service";
import {MasterDataService} from "../../../../service/masterdata.service";

@Component({
  selector: 'app-position-managerment-form',
  templateUrl: './position-managerment-form.component.html',
  styleUrls: ['./position-managerment-form.component.less']
})
export class PositionManagermentFormComponent implements OnInit {

  @Input() codeForm?: any;
  @Input() idPositionForm?: any;
  @Input() nameForm?: any;
  @Input() descriptionForm?: any;
  @Input() departmentIdForm?: any;
  @Input() isActive?: any;
  @Input() isVisibleModal = false;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Input() departmentCodeForm?: string;
  @Input() positionCategoryForm?: string;
  @Input() jobGroupForm?: string;


  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  checked = false;

  lstDepartment: any[] = [];
  lstPositionCategory: any[] = [];
  lstJobGroup: any[] = [];

  payloadDepartment = {name: null, status: null};
  payloadPosition = {name: null, status: null};

  isLoading = false;

  constructor(
    private modal: NzModalRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private positionService: PositionService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private departmentService: DepartmentService,
    private masterDataService: MasterDataService,
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      id: new FormControl(null),
      positionName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      positionCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      positionDescription: new FormControl(null),
      departmentCode: new FormControl(null, [Validators.required]),
      positionCategory: new FormControl(null, [Validators.required]),
      jobGroup: new FormControl(null),
      isActive: new FormControl(1, [Validators.required])
    });

    this.fetchDepartment();
    this.fetchPositionCategory();
    this.fetchJobGroup();

    if (this.isUpdate) {
      this.patchForm();
    }
  }

  patchForm() {
    setTimeout(() => {
      this.createForm.patchValue({
        id: this.idPositionForm,
        positionCode: this.codeForm,
        positionName: this.nameForm,
        positionDescription: this.descriptionForm,
        departmentCode: this.departmentCodeForm ?? null,
        positionCategory: this.positionCategoryForm ?? null,
        jobGroup: this.jobGroupForm ?? null,
        isActive: this.isActive ?? 1
      });
    });
  }


  handleCancelModal(): void {
    this.modal.destroy();
  }

  handleOkModal() {
    for (const i in this.createForm.controls) {
      this.createForm.controls[i].markAsDirty();
      this.createForm.controls[i].updateValueAndValidity();
    }

    console.log(this.createForm);
    if (this.createForm.valid) {
      const data = this.createForm.value;
      data.id = data.id ? data.id : null;
      data.positionCode = data.positionCode?.trim() ?? null;
      data.positionName = data.positionName?.trim() ?? null;
      data.positionDescription = data.positionDescription?.trim() ?? null;
      data.departmentCode = data.departmentCode ?? null;
      data.positionCategory = data.positionCategory ?? null;
      data.jobGroup = data.jobGroup ?? null;

      console.log("data1", data)
      this.spinner.show().then();

      const request = this.isUpdate
        ? this.positionService.editPosition(data)
        : this.positionService.createPosition(data);


      request.subscribe({
        next: (res) => {
          console.log("data",res)
          const code = res?.body?.code;
          if (code === "201") {
            const msg = this.isUpdate ? 'Cập nhật' : 'Thêm mới';
            this.toastService.openSuccessToast(`${msg} chức vụ thành công`);
            this.clickSave.emit();
            this.handleCancelModal();
          } else {
            this.toastService.openErrorToast(res?.body?.msgCode || 'Lỗi xử lý chức vụ');
            this.spinner.hide();
          }
        },
        error: (error) => {
          this.toastService.openErrorToast(error?.error?.msgCode || 'Lỗi hệ thống');
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      });


    }
  }

  fetchDepartment() {
    this.departmentService.getListDepartment(this.payloadDepartment).subscribe(
      res => {
        if (res && res.code === "OK") {
          this.lstDepartment = (res.data || []).map((item: any) => ({
            label: item.departmentName,
            value: item.departmentCode
          }));
        }
      },
      error => console.error("Lỗi API fetchDepartment:", error)
    );
  }


  fetchJobGroup() {
    this.masterDataService.getListJobGroup().subscribe(
      res => {
        if (res && res.code === "OK") {
          this.lstJobGroup = (res.data || []).map((item: any) => ({
            label: item.name,
            value: item.code
          }));
        }
      },
      error => console.error("Lỗi API fetchJobGroup:", error)
    );
  }


  fetchPositionCategory() {
    this.masterDataService.getListPositionCategory().subscribe(
      res => {
        if (res && res.code === "OK") {
          this.lstPositionCategory = (res.data || []).map((item: any) => ({
            label: item.name,
            value: item.code
          }));
        }
      },
      error => console.error("Lỗi API fetchPositionCategory:", error)
    );
  }


}
