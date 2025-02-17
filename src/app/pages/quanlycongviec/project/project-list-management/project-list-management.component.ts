import {Component, OnInit} from '@angular/core';
import {
  FormContractManagermentComponent
} from "../../../HRM/contract/form-contract-managerment/form-contract-managerment.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../service/toast.service";
import {ProjectService} from "../../../../service/project.service";

@Component({
  selector: 'app-project-list-management',
  templateUrl: './project-list-management.component.html',
  styleUrls: ['./project-list-management.component.less']
})
export class ProjectListManagementComponent implements OnInit {

  isLoading = false;
  isUpdate = false;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'created_date,desc', // -: desc | +: asc,
  };
  projects: any[] = [];
  idUserDetail: any;


  onEdit(id: any): void {
    this.router.navigate(['/project/detail/', id]);
  }

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private projectService: ProjectService,
              private activatedRoute: ActivatedRoute,
  ) {
    this.idUserDetail = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.idUserDetail = this.idUserDetail ? this.idUserDetail : null;
    this.spinner.show().then();

    this.projectService.search(this.idUserDetail).subscribe({
      next: (res) => {
        console.log(res);
        if (res && res.code === "OK") {
          this.projects = res.data;
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

  getListTask(projectId: any){
    this.router.navigate(['/task-board/'+projectId], {
      state: {
        page: this.request
      }
    })
  }

}
