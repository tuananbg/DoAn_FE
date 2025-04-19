import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {DataService} from "../../../service/data.service";
import {ScreenService} from "../../../service/screen.service";
import {map} from "rxjs/operators";
import {DxTabsTypes} from "devextreme-angular/ui/tabs";
import notify from "devextreme/ui/notify";
import {DxTextBoxTypes} from "devextreme-angular/ui/text-box";
import {TaskBoardManagementComponent} from "../task-board-management/task-board-management.component";
import {TaskFormManagementComponent} from "../task-form-management/task-form-management.component";
import {TaskListGridComponent} from "../task-list-grid/task-list-grid.component";
import {TaskForm} from "../../../core/task";
import {DxDataGridComponent} from "devextreme-angular";
import {
  FormEmployeeManagermentComponent
} from "../../HRM/employee/form-employee-managerment/form-employee-managerment.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {EmployeeService} from "../../../service/employee.service";
import {FileManagerService} from "../../../service/file-manager.service";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import * as moment from "moment";
import {TaskService} from "../../../service/task.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-task-list-management',
  templateUrl: './task-list-management.component.html',
  styleUrls: ['./task-list-management.component.less']
})
export class TaskListManagementComponent implements OnInit {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid!: DxDataGridComponent;

  @ViewChild(FormEmployeeManagermentComponent, {static: false}) contactNewForm!: FormEmployeeManagermentComponent;

  isPanelOpened = false;
  searchForm!: FormGroup;
  isUpdate = false;
  isLoading = false;
  userId: number | undefined;
  currentTabIndex = 0;
  statusList = ['DONE', 'PROCESSING',"TODO"];
  getStatusLabel(status: string): string {
    switch (status) {
      case 'TODO': return 'Cần làm';
      case 'PROCESSING': return 'Đang xử lý';
      case 'DONE': return 'Hoàn thành';
      default: return status;
    }
  }
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'createDate/DESC', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private taskService:TaskService,
    private fileManagerService: FileManagerService
  ) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.maxLength(100)]),
      status: new FormControl(null),
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const pageable = {
      page: currentPage,
      size: pageSize,
    };
    const status = this.statusList[this.currentTabIndex];
    this.spinner.show().then();
    this.taskService.getList(this.searchKeyword, status, pageable).subscribe(res => {
      if (res && res.code === "OK") {
          this.lstData = res.data.map((item: any) => {
          if (item.endDay) {
            const endDate = new Date(item.endDay);
            item.endDay = this.formatDate(endDate);
          }
          if (item.startDay) {
            const startDate = new Date(item.startDay);
            item.startDay = this.formatDate(startDate);
          }
          return item;
        });
        this.spinner.hide().then();
        if (this.lstData.length === 0) {
          if (this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData();
          }
        }
        this.spinner.hide().then();
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
      this.spinner.hide().then();
    }, () => {
      this.spinner.hide().then();
    });
  }
  searchKeyword: string | null = null;

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onTabChange(index: number) {
    this.currentTabIndex = index;
    this.request.currentPage = 0; // reset về trang đầu
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }


  refresh = () => {
    this.fetchData();
    this.dataGrid.instance.refresh();
  };

  rowClick(e: DxDataGridTypes.RowClickEvent) {
    const {data} = e;
    this.userId = data.id;
    this.isPanelOpened = true;
  }

  onOpenedChange = (value: boolean) => {
    if (!value) {
      this.userId == null;
    }
  };

  onPinnedChange = () => {
    this.dataGrid.instance.updateDimensions();
  };

  onCreateTask = () => {
    this.router.navigate(['/task/add']);
  };

  async onExporting(e: any) {
    // if (this.searchForm.invalid) return;
    // const queryModel = null;
    // const pageable = {
    //   sort: this.request.sort
    // };
    // await this.fetchData(this.request.currentPage, this.request.pageSize);
    // this.spinner.show().then();
    // if(this.lstData.length===0){
    //   return;
    // }
    // this.employeeService.exportEmployee(queryModel, pageable).subscribe(async response => {
    //   const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
    //   const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
    //   if (typeof responseData === "string") {
    //     const responseJson = JSON.parse(responseData);
    //     this.toastService.openErrorToast(responseJson.msgCode);
    //   } else {
    //     const currentDate = moment(new Date()).format('DDMMYYYY');
    //     this.fileManagerService.downloadFile(response, 'danhsachnhanvien_' + currentDate + '.xlsx');
    //   }
    // }, error => {
    //   this.toastService.openErrorToast(error);
    // }, () => {
    //   this.spinner.hide().then();
    // });
    // e.cancel = true;
  }

}
