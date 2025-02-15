import {Component, Input, OnInit} from '@angular/core';
import {Sales, SalesOrOpportunitiesByCategory} from "../../components/ticker-card/ticker-card.component";
import {SalesByState} from "../../components/timeoff-analysis-card/timeoff-analysis-card.component";
import {DashboardService} from "../../../service/dashboard.service";
import {ToastService} from "../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";

export type PanelItem = { text: string, value: string, key: number };
export type Dates = { startDate: string, endDate: string};
export const analyticsPanelItems: Array<PanelItem> = [
  {
    text: 'Week',
    value: '2020-01-24/2020-01-31',
    key: 1,
  }, {
    text: 'Month',
    value: '2020-01-01/2020-02-01',
    key: 3,
  }, {
    text: 'Year',
    value: '2020-01-01/2021-01-01',
    key: 4,
  }];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  salesByCategory!: SalesOrOpportunitiesByCategory;
  lstContractType!: SalesOrOpportunitiesByCategory;
  salesByState!: SalesByState;
  totalEmployee:any;
  totalBirthDayMonth:any;
  totalLateWork:any;
  totalLeaveWork:any;
  idUserDetailId: any;


  @Input() data!: SalesOrOpportunitiesByCategory;
  @Input() data2!: Sales;

  isLoading: boolean = true;

  constructor(
    private dashboardService:DashboardService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.idUserDetailId = userObject.userDetailId;
    this.loadStatisticalDepartment();
    this.loadStatisticalHeader();
    this.loadStatisticalContract();
    this.loadStatisticalTask();
  }

  parseJwt(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  loadStatisticalDepartment(){
    this.dashboardService.getStaticticalDepartment().subscribe(
      res => {
        if (res && res.code === "OK") {
          this.salesByCategory = res.data;
          this.spinner.hide().then();
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
        this.spinner.hide().then();
      }
    )
  }

  loadStatisticalHeader(){
    this.dashboardService.getStaticticalHeader(this.idUserDetailId).subscribe(
      res => {
        if (res && res.code === "OK") {
          this.totalEmployee = res.data.totalEmployee;
          this.totalBirthDayMonth = res.data.totalBirthDayMonth;
          this.totalLateWork = res.data.totalLateWork;
          this.totalLeaveWork = res.data.totalLeaveWork;
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
      }
    )
  }

  loadStatisticalContract(){
    this.dashboardService.getStaticticalContract().subscribe(
      res => {
        if (res && res.code === "OK") {
          this.lstContractType = res.data;
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
      }
    )
  }

  loadStatisticalTask(){
    this.dashboardService.getStatisticalTask().subscribe(
      res => {
        if (res && res.code === "OK") {
          this.salesByState = res.data;
        } else {
          this.toastService.openErrorToast(res.body.msgCode);
        }
      }
    )
  }


}
