import {Component, OnInit} from '@angular/core';
import {
  FormContractManagermentComponent
} from "../../../HRM/contract/form-contract-managerment/form-contract-managerment.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../service/toast.service";
import {ProjectService} from "../../../../service/project.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-project-list-management',
  templateUrl: './project-list-management.component.html',
  styleUrls: ['./project-list-management.component.less']
})
export class ProjectListManagementComponent implements OnInit {

  isLoading = false;
  isUpdate = false;
  currentTabIndex = 0;
  statusList = ['ACTIVE', 'INACTIVE'];
  backgroundImageUrl: string = '';
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'createDate/DESC', // -: desc | +: asc,
  };
  projects: any[] = [];
  idUserDetail: any;
  searchForm!: FormGroup;


  onEdit(id: any): void {
    this.router.navigate(['/project/detail/', id]);
  }

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private projectService: ProjectService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
  ) {
    this.idUserDetail = this.activatedRoute.snapshot.params['id'];
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;
    this.request.currentPage = 0;
    this.loadData();
  }

  searchKeyword: string | null = null; // Mặc định là null

  onSearchChanged(event: any) {
    this.searchKeyword = event.value ? event.value : null; // Nếu không nhập, đặt lại null
    this.loadData(this.request.currentPage, this.request.pageSize); // Gọi API
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.maxLength(100)]),
      status: new FormControl(null),
    });
    this.loadData(this.request.currentPage, this.request.pageSize);
  }

  loadData(currentPage?: number, pageSize?: number) {
    const pageable = {
      page: currentPage,
      size: pageSize,
    };
    const status = this.statusList[this.currentTabIndex];
    this.spinner.show().then();

    this.projectService.getList().subscribe({
      next: (res) => {
        if (res && res.code === "OK") {
          this.projects = res.data || [];
          this.projects.sort((a, b) => (a.createdDate > b.createdDate ? -1 : a.createdDate < b.createdDate ? 1 : 0));
        }
        this.spinner.hide().then();
      },
      error: (err) => {
        console.error("Lỗi API:", err);
        this.toastService.openErrorToast(err.error?.msgCode || "Đã xảy ra lỗi! Vui lòng thử lại.");
        this.spinner.hide().then();
      },
      complete: () => {
        console.log("Hoàn thành tải dữ liệu dự án.");
      }
    });
  }

    openCreateModal(): void {
    this.isUpdate = false
    this.router.navigate(['/project/add'], {
      state: {
        page: this.request,
        isUpdate: this.isUpdate
      }
    })
  }

  getListTask(project: any) {
    this.router.navigate(['/task-board/' + project.id], {
      state: {
        page: this.request,
        projectName: project.projectName
      }
    });
  }



}
