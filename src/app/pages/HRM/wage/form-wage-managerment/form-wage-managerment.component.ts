import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  UploadFileAttachmentComponent
} from "../../../components/upload-file-attachment/upload-file-attachment.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {ContractService} from "../../../../service/contract.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {WageService} from "../../../../service/wage.service";

@Component({
  selector: 'app-form-wage-managerment',
  templateUrl: './form-wage-managerment.component.html',
  styleUrls: ['./form-wage-managerment.component.less']
})
export class FormWageManagermentComponent implements OnInit {


  @Input() allowanceCodeForm?: any;
  @Input() allowanceNameForm?: any;
  @Input() idWageForm?: any;
  @Input() allowanceBaseForm?: any;
  @Input() allowanceDescriptionForm?: any;
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
    private wageService: WageService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      Id: new FormControl(null),
      allowanceCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      allowanceName: new FormControl(null, [Validators.required]),
      allowanceBase: new FormControl(null, [Validators.required]),
      file: new FormControl(null),
      allowanceDescription: new FormControl(null),
    });
    setTimeout(()=>{
      this.createForm.get('id')?.setValue(this.idWageForm);
      this.createForm.get('allowanceCode')?.setValue(this.allowanceCodeForm);
      this.createForm.get('allowanceName')?.setValue(this.allowanceNameForm);
      this.createForm.get('allowanceBase')?.setValue(this.allowanceBaseForm);
      this.createForm.get('allowanceDescription')?.setValue(this.allowanceDescriptionForm);
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
      data.wageId = data.wageId ? data.wageId : null;
      data.allowanceCode = data.allowanceCode ? data.allowanceCode : null;
      data.allowanceName = data.allowanceName ? data.allowanceName.trim() : null;
      data.allowanceBase = data.allowanceBase ? data.allowanceBase : null;
      data.allowanceDescription = data.allowanceDescription ? data.allowanceDescription.trim() : null;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.wageService.create(this.file, data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới phụ cấp thành công');
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
        this.wageService.edit(this.file, data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật phụ cấp thành công');
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
