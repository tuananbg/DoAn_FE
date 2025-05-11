import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../../service/employee.service';
import { ToastService } from '../../../../service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { Contact } from '../../../../core/contact';
import { FormEmployeeManagermentComponent } from '../form-employee-managerment/form-employee-managerment.component';

@Component({
  selector: 'app-detail-infor-employee',
  templateUrl: './detail-infor-employee.component.html',
  styleUrls: ['./detail-infor-employee.component.less']
})
export class DetailInforEmployeeComponent implements OnInit {
  user!: Contact;
  contactName = 'Quay lại danh sách';
  isLoading = false;
  isUserOffice = true;
  employeeCode: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    const employeeCode = this.activatedRoute.snapshot.paramMap.get('code');
    if (employeeCode) {
      this.employeeCode = employeeCode;
      this.loadUserByCode(employeeCode);
    }
  }

  redirectToPreviousPage() {
    this.router.navigate(['/employee']);
  }

  loadUserByCode(employeeCode: string) {
    this.isLoading = true;
    this.employeeService.getEmployeeCode(employeeCode).subscribe(
      (res) => {
        if (res && res.code === 'OK') {
          this.user = res.data;
          this.user.dateOfBirth = moment(this.user.dateOfBirth).format('YYYY-MM-DD');
        } else {
          this.toastService.openErrorToast(res.msgCode || 'Không tìm thấy nhân viên');
        }
        this.isLoading = false;
      },
      () => {
        this.toastService.openErrorToast('Lỗi khi tải thông tin nhân viên');
        this.isLoading = false;
      }
    );
  }

  onAvatarChanged(event: any) {
    const file = event.value[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEdit() {
    const modal: NzModalRef = this.modal.create({
      nzTitle: 'Chỉnh sửa thông tin nhân viên',
      nzContent: FormEmployeeManagermentComponent,
      nzWidth: '800px',
      nzComponentParams: {
        newUser: { ...this.user },
        isCreateMode: false
      },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.destroy()
        },
        {
          label: 'Lưu',
          type: 'primary',
          loading: false,
          onClick: (componentInstance: FormEmployeeManagermentComponent) => {
            const updatedUser = componentInstance.getNewContactData();
            const avatarFile = componentInstance.avatarFile;

            if (!updatedUser.code || !updatedUser.fullName) {
              this.toastService.openWarningToast('Vui lòng nhập đầy đủ thông tin');
              return;
            }

            this.spinner.show().then(() => {
              this.employeeService.editEmployee(avatarFile, updatedUser).subscribe(res=>{
                  if (res && res.code === "202"){
                    this.toastService.openSuccessToast('Cập nhật thành công');
                    this.loadUserByCode(this.employeeCode);
                    this.spinner.hide().then();
                    modal.destroy();
                  }
                  else {
                    this.toastService.openErrorToast(res.body?.msgCode || "Lỗi không xác định");
                  }
                  this.spinner.hide().then();
              }, error => {
                this.toastService.openErrorToast(error.error?.msgCode || "Lỗi kết nối");
                this.spinner.hide().then();
              });
            });
          }
        }
      ]
    });
  }


  async onExportPdf() {
    const data = document.getElementById('contentToConvert');
    if (!data) {
      this.toastService.openErrorToast('Không tìm thấy nội dung để xuất PDF');
      return;
    }

    this.spinner.show().then();
    await html2canvas(data, { useCORS: true }).then((canvas) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jspdf.default('p', 'mm', 'a4');
      let position = 0;

      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Ho_so_CBNV_' + this.employeeCode + '.pdf');
      this.spinner.hide().then();
    }).catch(() => {
      this.toastService.openErrorToast('Lỗi khi xuất PDF');
      this.spinner.hide().then();
    });
  }
}
