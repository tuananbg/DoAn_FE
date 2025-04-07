import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {PositionService} from "../../../../service/position.service";
import {DepartmentService} from "../../../../service/department.service";

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
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  checked = false;
  lstDepartment: any[] = [];
  lstPosition: any[] = [];
  payloadDepartment = {name: null, status: null};
  payloadPosition = {name: null, status: null};
  lstStatus = [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"}
  ]
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private positionService: PositionService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private departmentService: DepartmentService
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      id: new FormControl(null),
      positionName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      positionCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      positionDescription: new FormControl(null),
      departmentId: new FormControl(null),
      isActive: new FormControl(null, [Validators.required]),
    });

    this.fetchDepartment();
  }

  patchForm() {
    setTimeout(() => {
      this.createForm.patchValue({
        id: this.idPositionForm,
        positionCode: this.codeForm,
        positionName: this.nameForm,
        positionDescription: this.descriptionForm,
        departmentId: this.departmentIdForm,
        isActive: this.isActive,
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
    if (this.createForm.valid) {
      const data = this.createForm.value;
      data.id = data.id ? data.id : null;
      data.positionCode = data.positionCode ? data.positionCode.trim() : null;
      data.positionName = data.positionName ? data.positionName.trim() : null;
      data.positionDescription = data.positionDescription ? data.positionDescription.trim() : null;
      data.departmentId = data.departmentId === 0 ? 0 : !data.departmentId ? null : data.departmentId;
      data.isActive = data.isActive === 0 ? 0 : !data.isActive ? null : data.isActive;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.positionService.createPosition(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới chức vụ thành công');
            this.clickSave.emit();
            this.createForm.reset();
            this.isLoading = true;
            // this.clickCancel.emit();
            this.handleCancelModal();
          } else {
            this.toastService.openErrorToast(res.body.msgCode);
            this.spinner.hide().then();
          }
        }, error => {
          this.toastService.openErrorToast(error.error.msgCode);
          this.spinner.hide().then();
        }, () => {
          this.spinner.hide().then();
        });
      } else {
        this.positionService.editPosition(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật chức vụ thành công');
            this.clickSave.emit();
            this.clickCancel.emit();
            this.isLoading = true;
            this.handleCancelModal();
          } else {
            this.toastService.openErrorToast(res.body.msgCode);
          }
        }, error => {
          this.toastService.openErrorToast(error.error.msgCode);
        }, () => {
          this.spinner.hide().then();
        });
      }
    }
  }

  fetchDepartment() {
    this.departmentService.getListDepartment(this.payloadDepartment).subscribe(
      (res) => {
        if (res && res.code === "OK") {
          this.lstDepartment = res.data || [];
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", res);
        }
      },
      (error) => {
        console.error("Lỗi API:", error);
      }
    );
  }
  fetchPosition() {
    this.positionService.getSelection(this.payloadPosition).subscribe(
      (res) => {
        if (res && res.code === "OK") {
          this.lstPosition = res.data || [];
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", res);
        }
      },
      (error) => {
        console.error("Lỗi API:", error);
      }
    );
  }

}
