import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {PositionService} from "../../../../service/position.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DepartmentService} from "../../../../service/department.service";
import {
  UploadFileAttachmentComponent
} from "../../../components/upload-file-attachment/upload-file-attachment.component";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {Observable} from "rxjs";
import {ContractService} from "../../../../service/contract.service";

@Component({
  selector: 'app-form-contract-managerment',
  templateUrl: './form-contract-managerment.component.html',
  styleUrls: ['./form-contract-managerment.component.less']
})
export class FormContractManagermentComponent implements OnInit {


  @Input() contractCodeForm?: any;
  @Input() idContractForm?: any;
  @Input() contractTypeForm?: any;
  @Input() isVisibleModal = false;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  isLoading = false;
  file!: File;

  @ViewChild(UploadFileAttachmentComponent) uploadFileAttachmentComponent!: UploadFileAttachmentComponent;

  constructor(
    private modal: NzModalRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      id: new FormControl(null),
      contractCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      contractType: new FormControl(null, [Validators.required]),
      file: new FormControl(null),
    });
    setTimeout(()=>{
      this.createForm.get('id')?.setValue(this.idContractForm);
      this.createForm.get('contractCode')?.setValue(this.contractCodeForm);
      this.createForm.get('contractType')?.setValue(this.contractTypeForm);
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
      data.contractId = data.id ? data.id : null;
      data.contractCode = data.contractCode ? data.contractCode.trim() : null;
      data.contractType = data.contractType ? data.contractType.trim() : null;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.contractService.create(this.file, data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới hợp đồng thành công');
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
        this.contractService.edit(this.file, data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật hợp đồng thành công');
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

  onFileChanged(event: NzUploadChangeParam): void {
    const fileList = [...event.fileList];
    const uploadedFile = fileList.pop(); // Lấy ra file cuối cùng từ danh sách fileList
    if (uploadedFile) {
      // Thực hiện xử lý với file đã tải lên ở đây
      console.log('Uploaded file:', uploadedFile);
      this.file = uploadedFile.originFileObj!;
    }
  }

}
