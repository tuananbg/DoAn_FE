import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {QualificationService} from "../../../../service/qualification.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {SocialinsuranceService} from "../../../../service/socialinsurance.service";

@Component({
  selector: 'app-form-socialinsurance-managerment',
  templateUrl: './form-socialinsurance-managerment.component.html',
  styleUrls: ['./form-socialinsurance-managerment.component.less']
})
export class FormSocialinsuranceManagermentComponent implements OnInit {

  @Input() socialInsuranceCodeForm?: any;
  @Input() idSocialInsuranceForm?: any;
  @Input() initialPaymentForm?: any;
  @Input() percentForm?: any;
  @Input() actualPaymentForm?: any;
  @Input() licenseDateForm?: any;
  @Input() expiredDateForm?: any;
  @Input() isVisibleModal = false;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  isLoading = false;
  licenseDate: any;
  idUserDetail: any;
  constructor(
    private modal: NzModalRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private socialinsuranceService: SocialinsuranceService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private i18n: NzI18nService
  ) {
    this.idUserDetail = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.createForm = this.formBuilder.group({
      socialInsuranceId: new FormControl(null),
      socialInsuranceCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      initialPayment: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      percent: new FormControl(null),
      actualPayment: new FormControl(null),
      licenseDate: new FormControl(null),
      expiredDate: new FormControl(null),
    });
    setTimeout(()=>{
      this.createForm.get('socialInsuranceId')?.setValue(this.idSocialInsuranceForm);
      this.createForm.get('socialInsuranceCode')?.setValue(this.socialInsuranceCodeForm);
      this.createForm.get('initialPayment')?.setValue(this.initialPaymentForm);
      this.createForm.get('percent')?.setValue(this.percentForm);
      this.createForm.get('actualPayment')?.setValue(this.actualPaymentForm);
      this.createForm.get('licenseDate')?.setValue(this.licenseDateForm);
      this.createForm.get('expiredDate')?.setValue(this.expiredDateForm);
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
      data.socialInsuranceId = data.socialInsuranceId ? data.socialInsuranceId : null;
      data.socialInsuranceCode = data.socialInsuranceCode ? data.socialInsuranceCode : null;
      data.initialPayment = data.initialPayment ? data.initialPayment : null;
      data.percent = data.percent ? data.percent : null;
      data.actualPayment = data.actualPayment ?  data.actualPayment : null;
      data.licenseDate = data.licenseDate ? data.licenseDate : null;
      data.expiredDate = data.expiredDate ? data.expiredDate : null;
      data.userDetailId = this.idUserDetail;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.socialinsuranceService.create(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới thông tin bảo hiểm thành công');
            this.clickSave.emit();
            this.createForm.reset();
            this.isLoading = true;
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
        this.socialinsuranceService.edit(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật thông tin bảo hiểm thành công');
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

  onChangeInitialPayment(event: any){
    if(event){
      if(this.createForm.getRawValue().percent){
        const getPersent = this.createForm.getRawValue().percent;
        const priceFinal = event.target.value - (event.target.value * (getPersent / 100));
        this.createForm.get('actualPayment')?.setValue(priceFinal);
      }
    }
  }

  onChangePercent(event: any){
    if(event){
      if(this.createForm.getRawValue().initialPayment){
        const getInitialPayment = this.createForm.getRawValue().initialPayment;
        const priceFinal = getInitialPayment - (getInitialPayment * (event.target.value / 100));
        this.createForm.get('actualPayment')?.setValue(priceFinal);
      }
    }
  }
}
