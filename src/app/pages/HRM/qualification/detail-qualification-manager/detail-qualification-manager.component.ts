import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import { formatDate } from '@angular/common';
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DepartmentService} from "../../../../service/department.service";
import {QualificationService} from "../../../../service/qualification.service";
import {en_US, NzI18nService} from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-detail-qualification-manager',
  templateUrl: './detail-qualification-manager.component.html',
  styleUrls: ['./detail-qualification-manager.component.less']
})
export class DetailQualificationManagerComponent implements OnInit {

  @Input() levelForm?: any;
  @Input() idQualificationForm?: any;
  @Input() nameForm?: any;
  @Input() majorForm?: any;
  @Input() descriptionForm?: any;
  @Input() licenseDateForm?: any;
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
    private qualificationService: QualificationService,
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
      level: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      major: new FormControl(null),
      description: new FormControl(null),
      licenseDate: new FormControl(null),
    });
    setTimeout(()=>{
      this.createForm.get('id')?.setValue(this.idQualificationForm);
      this.createForm.get('level')?.setValue(this.levelForm);
      this.createForm.get('name')?.setValue(this.nameForm);
      this.createForm.get('major')?.setValue(this.majorForm);
      this.createForm.get('description')?.setValue(this.descriptionForm);
      this.createForm.get('licenseDate')?.setValue(this.licenseDateForm);
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
      data.level = data.level ? data.level.trim() : null;
      data.name = data.name ? data.name.trim() : null;
      data.major = data.major ? data.major.trim() : null;
      data.description = data.description ?  data.description : null;
      data.licenseDate = data.licenseDate ? data.licenseDate : null;
      data.userDetailId = this.idUserDetail;
      if (!this.isUpdate) {
        this.spinner.show().then();
        this.qualificationService.create(data).subscribe(res => {
          if (res && res.body.code === "OK") {
            this.toastService.openSuccessToast('Thêm mới bằng cấp thành công');
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
        this.qualificationService.edit(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast('Cập nhật bằng cấp thành công');
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

}
