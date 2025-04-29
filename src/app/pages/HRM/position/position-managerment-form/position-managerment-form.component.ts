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

  handleOkModal(): void {
    // 1. Đánh dấu toàn bộ field để validate
    Object.values(this.createForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    // 2. Nếu hợp lệ mới tiếp tục
    if (this.createForm.valid) {
      // Chuẩn hóa dữ liệu đầu vào
      const formValue = this.createForm.value;
      const data = {
        id: this.isUpdate ? formValue.id : null,
        positionCode: formValue.positionCode?.trim() || null,
        positionName: formValue.positionName?.trim() || null,
        positionDescription: formValue.positionDescription?.trim() || null,
        departmentCode: formValue.departmentCode || null,
        positionCategory: formValue.positionCategory || null,
        jobGroup: formValue.jobGroup || null
      };

      this.spinner.show();

      // 3. Chọn API phù hợp (tạo mới hoặc cập nhật)
      const request$ = this.isUpdate
        ? this.positionService.editPosition(data)
        : this.positionService.createPosition(data);

      // 4. Gọi API và xử lý phản hồi
      request$.subscribe({
        next: (res) => {
          // Nếu bạn dùng observe: 'response' -> lấy res.body
          const result = res?.body ?? res;

          if (result.code === '201' || result.code === '202') {
            const action = this.isUpdate ? 'Cập nhật' : 'Thêm mới';
            this.toastService.openSuccessToast(`${action} chức vụ thành công`);
            this.clickSave.emit();
            this.handleCancelModal();
          } else {
            this.toastService.openErrorToast(result?.msgCode || 'Lỗi xử lý chức vụ');
            this.spinner.hide();
          }
        },
        error: (err) => {
          this.toastService.openErrorToast(err?.error?.msgCode || 'Lỗi hệ thống');
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
