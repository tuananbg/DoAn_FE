import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {QualificationService} from "../../../../service/qualification.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {ContractService} from "../../../../service/contract.service";

@Component({
  selector: 'app-form-contract-for-employee',
  templateUrl: './form-contract-for-employee.component.html',
  styleUrls: ['./form-contract-for-employee.component.less']
})
export class FormContractForEmployeeComponent implements OnInit {

  @Input() contractTypeForm?: any;
  @Input() idUserContractForm?: any;
  @Input() activeDateForm?: any;
  @Input() expiredDateForm?: any;
  @Input() signDateForm?: any;
  @Input() isVisibleModal = false;
  @Input() dataChild = null;
  @Input() isUpdate = false;
  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  isLoading = false;
  licenseDate: any;
  idUserDetail: any;
  lstContractType = [];
  payloadContract = {contractCode: null, contractType: null};
  activeDateErrorMessage = '';
  extendDateErrorMessage = '';
  signDateErrorMessage = '';

  constructor(
    private modal: NzModalRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private contractService: ContractService,
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
      id: new FormControl(null),
      contractType: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      activeDate: new FormControl(null),
      expiredDate: new FormControl(null),
      signDate: new FormControl(null),
    });
    setTimeout(() => {
      this.createForm.get('id')?.setValue(this.idUserContractForm);
      this.createForm.get('contractType')?.setValue(this.contractTypeForm);
      this.createForm.get('activeDate')?.setValue(this.activeDateForm);
      this.createForm.get('expiredDate')?.setValue(this.expiredDateForm);
      this.createForm.get('signDate')?.setValue(this.signDateForm);
    });
    this.fetchContract();
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
      data.contractId = data.contractType === 0 ? 0 : !data.contractType ? null : data.contractType;
      data.activeDate = data.activeDate ? data.activeDate : null;
      data.expiredDate = data.expiredDate ? data.expiredDate : null;
      data.signDate = data.signDate ? data.signDate : null;
      data.userDetailId = this.idUserDetail;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.contractService.createForEmployee(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới hợp đồng cho nhân viên thành công');
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
        this.contractService.editForEmployee(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật hợp đồng cho nhân viên thành công');
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

  fetchContract() {
    this.contractService.search(this.payloadContract, {page: 0, size: -1}).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstContractType = res.data.data;
        // this.lstContractType.sort((a, b) => a.contractCode.localeCompare(b.contractCode));
      }
    }, (error: any) => {
      console.log(error);
    })
  }

  onChangeActiveDate(event: any) {
    if (event) {
      const activeDate = new Date(event);
      this.activeDateErrorMessage = '';
      if (this.createForm.getRawValue().expiredDate) {
        const expiredDate = new Date(this.createForm.getRawValue().expiredDate);
        if (activeDate >= expiredDate) {
          this.createForm.get('activeDate')?.setErrors({
            'lessThanExpire': true
          });
          this.activeDateErrorMessage = this.activeDateErrorMessage + 'Ngày hiệu lực phải trước Ngày hết hạn';
          this.createForm.get('activeDate')?.markAsDirty();
          return;
        } else {
          this.createForm.get('activeDate')?.setErrors(null);
          this.createForm.get('expiredDate')?.setErrors(null);
          this.activeDateErrorMessage = '';
          this.extendDateErrorMessage = '';
        }
      }
      if (this.createForm.getRawValue().signDate) {
        const signDate = new Date(this.createForm.getRawValue().signDate);
        if (activeDate <= signDate) {
          this.createForm.get('activeDate')?.setErrors({
            'lessThanExpire': true
          });
          this.activeDateErrorMessage = this.activeDateErrorMessage + 'Ngày hiệu lực phải sau hoặc cùng Ngày ký kết';
          this.createForm.get('activeDate')?.markAsDirty();
        } else {
          this.createForm.get('activeDate')?.setErrors(null);
          this.createForm.get('signDate')?.setErrors(null);
          this.activeDateErrorMessage = '';
          this.signDateErrorMessage = '';
        }
      }
    } else {
      if (this.createForm.get('activeDate')?.touched) {
        this.createForm.get('activeDate')?.setErrors({
          'required': true
        });
        this.activeDateErrorMessage = 'Ngày hiệu lực không được để trống';
        this.createForm.get('activeDate')?.markAsDirty();
      }
    }
  }

  onChangeExpiredDate(event: any) {
    if (event) {
      const expiredDate = new Date(event);
      if (event && this.createForm.getRawValue().activeDate) {
        const activeDate = new Date(this.createForm.getRawValue().activeDate);
        if (expiredDate <= activeDate) {
          this.createForm.get('expiredDate')?.setErrors({
            'lessThanExpire': true
          });
          this.extendDateErrorMessage = 'Ngày hết hạn phải sau Ngày hiệu lực';
          return;
        } else {
          this.onChangeExpiredDate(this.createForm.getRawValue().activeDate);
          this.createForm.get('expiredDate')?.setErrors(null);
          this.extendDateErrorMessage = '';
        }
      }
      if (this.createForm.getRawValue().signDate) {
        const signDate = new Date(this.createForm.getRawValue().signDate);
        if (expiredDate < signDate) {
          this.createForm.get('expiredDate')?.setErrors({
            'lessThanExpire': true
          });
          this.extendDateErrorMessage = 'Ngày hết hạn phải sau hoặc cùng Ngày ký kết';
          this.createForm.get('expiredDate')?.markAsDirty();
        } else {
          this.createForm.get('expiredDate')?.setErrors(null);
          this.createForm.get('signDate')?.setErrors(null);
          this.extendDateErrorMessage = '';
          this.signDateErrorMessage = '';
        }
      }
    } else {
      if (this.createForm.get('expiredDate')?.touched) {
        this.createForm.get('expiredDate')?.setErrors({
          'required': true
        });
        this.activeDateErrorMessage = 'Ngày hết hạn không được để trống';
        this.createForm.get('expiredDate')?.markAsDirty();
      }
    }
  }

  onChangeSignDate(event: any) {
    if (event) {
      const signDate = new Date(event);
      if (this.createForm.getRawValue().activeDate) {
        const activeDate = new Date(this.createForm.getRawValue().activeDate);
        if (signDate >= activeDate) {
          this.createForm.get('signDate')?.setErrors({
            'lessThanExpire': true
          });
          this.signDateErrorMessage = 'Ngày ký kết phải trước Ngày hiệu lực';
          this.createForm.get('signDate')?.markAsDirty();
          return;
        } else {
          this.createForm.get('signDate')?.setErrors(null);
          this.createForm.get('activeDate')?.setErrors(null);
          this.signDateErrorMessage = '';
          this.extendDateErrorMessage = '';
        }
      }
      if (this.createForm.getRawValue().expiredDate) {
        const expiredDate = new Date(this.createForm.getRawValue().expiredDate);
        if (signDate >= expiredDate) {
          this.createForm.get('signDate')?.setErrors({
            'lessThanExpire': true
          });
          this.signDateErrorMessage = 'Ngày ký kết phải trước Ngày hết hạn';
          this.createForm.get('signDate')?.markAsDirty();
        } else {
          this.createForm.get('signDate')?.setErrors(null);
          this.createForm.get('expiredDate')?.setErrors(null);
          this.signDateErrorMessage = '';
          this.extendDateErrorMessage = '';
        }
      }
    } else {
      if (this.createForm.get('signDate')?.touched) {
        this.createForm.get('signDate')?.setErrors({
          'required': true
        });
        this.signDateErrorMessage = 'Ngày ký kết không được để trống';
        this.createForm.get('signDate')?.markAsDirty();
      }
    }
  }

}
