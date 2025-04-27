import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {DataService} from "../../../../service/data.service";
import {ScreenService} from "../../../../service/screen.service";
import {map} from "rxjs/operators";
import {DxTabsTypes} from "devextreme-angular/ui/tabs";
import notify from "devextreme/ui/notify";
import {DxTextBoxTypes} from "devextreme-angular/ui/text-box";
import {TaskBoardManagementComponent} from "../../project/task-board-management/task-board-management.component";
import {TaskFormManagementComponent} from "../task-form-management/task-form-management.component";
import {TaskListGridComponent} from "../../task-employee/task-list-grid/task-list-grid.component";
import {TaskForm} from "../../../../core/task";
import {DxDataGridComponent} from "devextreme-angular";
import {
  FormEmployeeManagermentComponent
} from "../../../HRM/employee/form-employee-managerment/form-employee-managerment.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {EmployeeService} from "../../../../service/employee.service";
import {FileManagerService} from "../../../../service/file-manager.service";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import * as moment from "moment";
import {TaskService} from "../../../../service/task.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-task-list-management',
  templateUrl: './task-list-management.component.html',
  styleUrls: ['./task-list-management.component.less']
})
export class TaskListManagementComponent implements OnInit {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid!: DxDataGridComponent;

  @ViewChild(FormEmployeeManagermentComponent, {static: false}) contactNewForm!: FormEmployeeManagermentComponent;

  isActive = true;
  isPanelOpened = false;
  searchForm!: FormGroup;
  isUpdate = false;
  isLoading = false;
  userId: number | undefined;
  currentTabIndex = 0;
  statusList = ["TODO", 'PROCESSING','DONE'];
  getStatusLabel(status: string): string {
    switch (status) {
      case 'TODO': return 'Cần làm';
      case 'PROCESSING': return 'Đang xử lý';
      case 'DONE': return 'Hoàn thành';
      default: return status;
    }
  }
  lstTaskStatus: any[] = [
    {code: 1, name: "Chưa làm"},
    {code: 2, name: "Đang xử lý"},
    {code: 3, name: "Hoàn thành"},
  ];
  lstPriority: any[] = [
    {code: 1, name: "Thấp"},
    {code: 2, name: "Trung bình"},
    {code: 3, name: "Cao"},
  ];

  // mapTaskStatus(status: string | number): string {
  //   const statusMap: any = {
  //     '1': 'Chưa làm',
  //     '2': 'Đang xử lý',
  //     '3': 'Hoàn thành'
  //   };
  //   return statusMap[status] || 'Không rõ';
  // }
  //
  // mapPriority(priority: number): string {
  //   const map: any = {
  //     1: 'Thấp',
  //     2: 'Trung bình',
  //     3: 'Cao'
  //   };
  //   return map[priority] || 'Không rõ';
  // }

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
      keyword: new FormControl(null, [Validators.maxLength(100)]),
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage: number = 0, pageSize: number = 10): void {
    const pageable = { page: currentPage, size: pageSize };
    const status = this.statusList[this.currentTabIndex];

    this.spinner.show().then();

    this.taskService.getList(this.searchKeyword, status, pageable).subscribe({
      next: (res) => {
        if (res && res.code === "OK" && res.data && res.data.content) {
          this.lstData = res.data.content.map((item: any) => ({
            id: item.id,
            taskCode: item.taskCode,
            taskName: item.taskName,
            employeeName: item.employeeName,
            managerName: item.managerName,
            taskStatus: item.status, // chuyển code sang label
            startDay: item.startDay ? this.formatDate(item.startDay) : '',
            endDay: item.endDay ? this.formatDate(item.endDay) : '',
            priority: item.priority,
            projectName: item.projectName || '',
          }));
        } else {
          this.lstData = [];
          this.toastService.openErrorToast(res?.msgCode || "Không thể lấy dữ liệu");
        }
      },
      error: (err) => {
        this.toastService.openErrorToast(err?.error?.msgCode || "Lỗi server");
      },
      complete: () => {
        this.spinner.hide().then();
      }
    });
  }


  searchKeyword: string | null = null;

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.fetchData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

  nzOnSearch(): void {
    this.request.currentPage = 0;
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ''; // Kiểm tra ngày hợp lệ
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
    // Kiểm tra dữ liệu dòng khi click
    const taskCode = e.data?.taskCode;
    console.log("data",e.data)
    this.router.navigate(['/task/update', taskCode]);
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
    if (this.searchForm.invalid) return;

    await this.fetchData(this.request.currentPage, this.request.pageSize);
    this.spinner.show().then();

    if (this.lstData.length === 0) {
      this.spinner.hide().then(); // đừng quên hide luôn
      return;
    }

    const status = this.statusList[this.currentTabIndex];

    this.taskService.exportEmployee(status).subscribe(
      async response => {
        const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
        const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};

        if (typeof responseData === "string") {
          const responseJson = JSON.parse(responseData);
          this.toastService.openErrorToast(responseJson.msgCode);
        } else {
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName = 'export.xlsx'; // fallback filename

          if (contentDisposition) {
            const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
            if (match && match[1]) {
              fileName = decodeURIComponent(match[1]);
            }
          }

          this.fileManagerService.downloadFile(response, fileName);
        }
      },
      error => {
        this.toastService.openErrorToast(error);
      },
      () => {
        this.spinner.hide().then();
      }
    );

    e.cancel = true;
  }

}
