import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.less']
})
export class ModalConfirmComponent implements OnInit {
  @Input() isVisible = false;
  @Input() title!: string;
  @Input() description = '';
  @Input() descriptionHTML: any;
  @Input() content!: string;
  @Input() text: string = '';
  @Input() textButtonCancel!: string;
  @Input() textButtonConfirm!: string;
  @Input() textButtonDelete!: string;
  @Input() hiddenBtnCancel = false;
  @Input() hiddenContent = false;
  @Output() clickCancel = new EventEmitter();
  @Output() callBack = new EventEmitter();
  @Output() clickConfirm = new EventEmitter();
  @Input() isDelete = false;
  @Input() isConfirm = false;
  @Input() name!: string;

  //
  @Input() hiddenBtnOK = false;
  @Input() isConfirmCancel = true;
  @Input() isLock = false;
  @Input() isCancelLeave = false;
  @Input() isDescHTML = false;
  @Input() isEdit = false;
  @Input() isNotAllowedCreate = false;
  @Input() isPartnerCodeErr = false;
  @Input() isPermissionCodeErr = false;
  @Input() recordId!: string;
  @Input() hasReason = false;
  @Input() reasonRequired = false;
  @Input() reasonLabel = 'Lý do';
  @Input() reasonPlaceholder = 'Nhập lý do';
  @Input() nzWidth = 369;
  @Input() titleTooltip!: string;
  @Input() descriptionTooltip!: string;

  saveForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.saveForm = this.formBuilder.group({
      reason: new FormControl(null),
    });
    if (this.reasonRequired) this.saveForm.get('reason')?.setValidators([Validators.required, Validators.maxLength(1000)]);
  }

  openModal() {

  }

  handleCancelModal() {
    this.resetForm();
    this.clickCancel.emit();
  }

  handleOkModal() {
    if (this.hasReason) {
      this.saveForm.get('reason')?.markAsTouched();
      this.saveForm.get('reason')?.markAsDirty();
      this.saveForm.get('reason')?.updateValueAndValidity();
      if (this.saveForm.invalid) return;
      this.callBack.emit(this.saveForm.value);
      this.resetForm();
    } else
      this.callBack.emit(this.recordId);
  }

  handleDelete() {
    if (this.hasReason) {
      this.saveForm.get('reason')?.markAsTouched();
      this.saveForm.get('reason')?.markAsDirty();
      this.saveForm.get('reason')?.updateValueAndValidity();
      if (this.saveForm.invalid) return;
      this.callBack.emit(this.saveForm.value);
      this.resetForm();
    } else
      this.callBack.emit();
  }

  resetForm(): void {
    this.saveForm.reset();
  }

  onClear() {
    this.saveForm.setValue({reason: ''});
  }

  handleConfirm() {
    this.clickConfirm.emit();
  }

}
