import {ToastService} from '../../../../service/toast.service';
import {DepartmentService} from '../../../../service/department.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.less']
})
export class CreateDepartmentComponent implements OnInit {

  @Input() codeForm?: any;
  @Input() nameForm?: any;
  @Input() status?: any;
  @Input() isVisibleModal = false;
  @Input() idDepartment: any;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  checked = false;
  lstStatus = [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"}
  ]
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      departmentName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      departmentCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      status: new FormControl(null, [Validators.required]),
    });
    setTimeout(()=>{
      this.createForm.get('departmentCode')?.setValue(this.codeForm);
      this.createForm.get('departmentName')?.setValue(this.nameForm);
      this.createForm.get('status')?.setValue(this.status);
    });
  }

  // handleCancelModal() {
  //   Object.keys(this.createForm.controls).forEach(key => {
  //     this.createForm.controls[key].setErrors(null);
  //   });
  //   this.createForm.reset()
  //   this.clickCancel.emit();
  //   this.checked = false;
  // }

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
      data.departmentCode = data.departmentCode ? data.departmentCode.trim() : null;
      data.departmentName = data.departmentName ? data.departmentName.trim() : null;
      data.status = data.status === 0 ? 0 : !data.status ? null : data.status;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.departmentService.createDepartment(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới phòng ban thành công');
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
        this.departmentService.editDepartment(data, this.idDepartment).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật phòng ban thành công');
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

  goToList() {
    this.router.navigate(['/department']);
  }



}
