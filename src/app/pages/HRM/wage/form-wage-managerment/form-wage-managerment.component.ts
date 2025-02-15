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


  @Input() wageNameForm?: any;
  @Input() idWageForm?: any;
  @Input() wageBaseForm?: any;
  @Input() wageDescriptionForm?: any;
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
      wageId: new FormControl(null),
      wageName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      wageBase: new FormControl(null, [Validators.required]),
      file: new FormControl(null),
      wageDescription: new FormControl(null),
    });
    setTimeout(()=>{
      this.createForm.get('wageId')?.setValue(this.idWageForm);
      this.createForm.get('wageName')?.setValue(this.wageNameForm);
      this.createForm.get('wageBase')?.setValue(this.wageBaseForm);
      this.createForm.get('wageDescription')?.setValue(this.wageDescriptionForm);
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
      data.wageName = data.wageName ? data.wageName.trim() : null;
      data.wageBase = data.wageBase ? data.wageBase : null;
      data.wageDescription = data.wageDescription ? data.wageDescription.trim() : null;
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
