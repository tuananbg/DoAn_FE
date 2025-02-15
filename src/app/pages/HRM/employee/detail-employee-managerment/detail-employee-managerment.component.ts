import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../../service/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../../../../service/employee.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import html2canvas from "html2canvas";
import * as jspdf from "jspdf";
@Component({
  selector: 'app-detail-employee-managerment',
  templateUrl: './detail-employee-managerment.component.html',
  styleUrls: ['./detail-employee-managerment.component.less']
})
export class DetailEmployeeManagermentComponent implements OnInit {

  contactId!: number;

  contactName = 'Quay lại danh sách';

  isLoading = false;
  isPanelOpened = true;
  userId: any;

  request: any = {
    listTextSearch: [],
    code: null,
    page: 0,
    name: null,
    size: 10, // -: desc | +: asc,
  };

  constructor(
    private service: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private fileManagerService: FileManagerService
  ) {
    this.contactId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.userId = userObject.userDetailId;
  }

  parseJwt(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  refresh = () => {
    this.isLoading = true;
  };

  redirectToPreviousPage() {
    this.router.navigate(['/employee']);
  }

//  async onExportPdf() {
    // this.spinner.show().then();
    // this.employeeService.exportPdf().subscribe(async res => {
    //   const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
    //   const responseData = isJsonBlob(res.body) ? await (res.body).text() : res.body || {};
    //   if (typeof responseData === "string") {
    //     const resJson = JSON.parse(responseData);
    //     this.toastService.openErrorToast(resJson.msgCode);
    //   } else {
    //     const currentDate = moment(new Date()).format('DDMMYYYY');
    //     this.fileManagerService.downloadFile(res, 'ho_so_nhan_vien_' + currentDate + '.pdf');
    //     this.toastService.openSuccessToast('Xuất pdf thành công');
    //   }
    //   this.spinner.hide().then();
    // }, error => {
    //   this.toastService.openErrorToast(error.error.msgCode);
    //   this.spinner.hide().then();
    // });
//  }

  onExportPdf(){
    this.router.navigate(['/infor-employee/' + this.userId], {state: {page: this.request}});
  }
}
