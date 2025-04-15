import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {ContractService} from "../../../../service/contract.service";
import {EmployeeService} from "../../../../service/employee.service";

@Component({
  selector: 'app-form-contract-managerment',
  templateUrl: './form-contract-managerment.component.html',
  styleUrls: ['./form-contract-managerment.component.less']
})
export class FormContractManagermentComponent implements OnInit {

  @Input() contractCodeForm?: string;
  @Input() contractTypeForm?: string;
  @Input() idContractForm?: number;
  @Input() isUpdate = false;

  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();

  createForm!: FormGroup;
  isLoading = false;
  file!: File;
  uploadedFileName: string = '';
  employeeOptions: { label: string; value: string }[] = [];
  contractTypes = [
    {label: 'Chính thức', value: '01'},
    {label: 'Học việc', value: '02'},
    {label: 'Thử việc', value: '03'}
  ];


  constructor(
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      id: [null],
      contractNumber: [null, [Validators.required, Validators.maxLength(100)]],
      contractType: [null, [Validators.required]],
      contractSignDate: [null],
      contractEffectiveDate: [null],
      contractEndDate: [null],
      basicSalaryInsurance: [null],
      basicSalary: [null],
      employeeCode: [null, [Validators.required]],
      attachFile: [null]
    });

    this.getEmployees();
    if (this.isUpdate) {
      this.createForm.patchValue({
        id: this.idContractForm ?? null,
        contractCode: this.contractCodeForm ?? null,
        contractType: this.contractTypeForm ?? null
        // Các trường còn lại sẽ do người dùng nhập
      });
    }
  }

  getEmployees(): void {
    this.employeeService.getList(null, 'EMPLOYMENT', null).subscribe((res) => {
      const list = res?.data?.content || [];
      this.employeeOptions = list.map((emp: any) => ({
        label: `${emp.employeeCode} - ${emp.employeeName}`,
        value: emp.employeeCode
      }));
    });
  }


  handleCancelModal(): void {
    this.modal.destroy();
  }

  handleOkModal(): void {
    Object.values(this.createForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (this.createForm.valid) {
      const formValue = this.createForm.value;
      const data: any = {
        contractNumber: formValue.contractNumber?.trim() ?? null,
        contractType: formValue.contractType?.trim() ?? null,
        contractSignDate: formValue.contractSignDate,
        contractEffectiveDate: formValue.contractEffectiveDate,
        contractEndDate: formValue.contractEndDate,
        basicSalaryInsurance: formValue.basicSalaryInsurance,
        basicSalary: formValue.basicSalary,
        employeeCode: formValue.employeeCode,
        attachFile: this.uploadedFileName
      };

      this.spinner.show().then();

      const observable = this.isUpdate
        ? this.contractService.edit(this.file, data)
        : this.contractService.create(this.file, data);

      observable.subscribe(
        res => {
          if (res?.body?.code === "201") {
            const msg = this.isUpdate ? 'Cập nhật' : 'Thêm mới';
            this.toastService.openSuccessToast(`${msg} hợp đồng thành công`);
            this.clickSave.emit();
            this.handleCancelModal();
          } else {
            this.toastService.openErrorToast(res.body?.msgCode || 'Lỗi xử lý hợp đồng');
          }
          this.spinner.hide().then();
        },
        error => {
          this.toastService.openErrorToast(error.error?.msgCode || 'Lỗi hệ thống');
          this.spinner.hide().then();
        }
      );
    }
  }

  onFileChanged(event: NzUploadChangeParam): void {
    const uploadedFile = event.file?.originFileObj;
    if (uploadedFile) {
      this.file = uploadedFile;
      this.uploadedFileName = event.file.name;
      this.createForm.get('attachFile')?.setValue(this.uploadedFileName);
    }
  }
}
