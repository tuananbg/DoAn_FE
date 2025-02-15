import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../service/user.service";
import {UserSearchRequest, UserSearchResponse} from "./types/userSearch";

@Component({
  selector: 'app-user-managerment',
  templateUrl: './user-managerment.component.html',
  styleUrls: ['./user-managerment.component.less']
})
export class UserManagermentComponent implements OnInit {
  searchActive: boolean = true
  resultActive: boolean = true
  tableLoading: boolean = false
  modalActive: boolean = false
  searchUserRequest: UserSearchRequest = {
    fullname: '',
    gender: null,
    birthday: '',
    provinceId: null,
    departmentId: null,
    contract_createdate: '',
    companyId: null
  }
  pagination: {total: number, current: number, pageSize: number} = {
    total: 0,
    current: 0,
    pageSize: 10
  }


  columns = [
    {
      title: 'Họ và tên',
      width: '200px',
      compare: (a: any, b: any) => a.fullName - b.fullName,
    },
    {
      title: 'Giới tính',
      width: '100px',
      compare: (a: any, b: any) => a.gender - b.gender,
    },
    {
      title: 'Ngày sinh',
      width: '100px',
      compare: (a: any, b: any) => a.birthday - b.birthday,
    },
    {
      title: 'Email',
      width: '240px',
      compare: (a: any, b: any) => a.email - b.email,
    },
    {
      title: 'Địa chỉ',
      width: '300px',
      compare: (a: any, b: any) => a.address - b.address,
    },
    {
      title: 'Nơi sinh',
      width: '140px',
      compare: (a: any, b: any) => a.birthPlace - b.birthPlace,
    },
    {
      title: 'Phòng ban',
      width: '180px',
      compare: (a: any, b: any) => a.departmentName - b.departmentName,
    },
    {
      title: 'Ngày tạo',
      width: '140px',
      compare: (a: any, b: any) => a.createdAt - b.createdAt,
    }
  ];
  searchUserRespone: Array<UserSearchResponse> = []

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getData()
  }
  getData(){
    this.tableLoading = true
    this.userService.getAllUser(this.searchUserRequest, this.pagination.current, this.pagination.pageSize).subscribe({
      next: (res) => {
        this.searchUserRespone = res.dataList
        this.pagination.current = res.pageIndex
        this.pagination.pageSize = res.pageSize
        this.pagination.total = res.totalElements
      },
      complete: () => {
        this.tableLoading = false
      }
    })
  }
  handlePageIndexChange ($event: number) {
    this.pagination.current = $event - 1
    this.getData()
  }

  handlePageSizeChange ($event: number) {
    this.pagination.pageSize = $event
    this.getData()
  }

}
