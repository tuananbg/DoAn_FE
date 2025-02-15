import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../../service/login.service";
import {MenuItem, Role} from "../../system/account-management/types/account";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.less']
})
export class SideBarComponent implements OnInit, DoCheck {
  isCollapsed = false
  subMenuQLNS: boolean = false
  subMenuLLV: boolean = false
  subMenuQLHT: boolean = false
  subMenuQLCV: boolean = false
  employeeName: any;
  userId: any;
  listRolesMenuItem: any;
  isVisibleAdmin: any;

  request: any = {
    listTextSearch: [],
    code: null,
    page: 0,
    name: null,
    size: 10, // -: desc | +: asc,
  };

  constructor(private router: Router,
              private loginService: LoginService) {
  }

  ngDoCheck(): void {
    if (this.router.url === '/user') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    } else if (this.router.url === '/department') {
      this.subMenuQLNS = true
      this.subMenuLLV = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    } else if (this.router.url === '/position') {
      this.subMenuQLNS = true
      this.subMenuLLV = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    } else if (this.router.url === '/employee') {
      this.subMenuQLNS = true
      this.subMenuLLV = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    } else if (this.router.url.includes('/detail-employee') || this.router.url.includes('/infor-employee')) {
      this.subMenuQLNS = true
      this.subMenuLLV = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    } else if (this.router.url === '/contract' || this.router.url === '/wage') {
      this.subMenuQLNS = true
      this.subMenuLLV = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    } else if (this.router.url === '/attendance' || this.router.url === '/attendanceleave' || this.router.url === '/attendanceOt') {
      this.subMenuLLV = true
      this.subMenuQLNS = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    } else if (this.router.url === '/register' || this.router.url === '/system' || this.router.url === '/account') {
      this.subMenuQLHT = true
      this.subMenuQLNS = false
      this.subMenuLLV = false
      this.subMenuQLCV = false
    } else if (this.router.url.includes("/project") ||
      this.router.url.includes("/task-list") ||
      this.router.url.includes("/task-board") ||
      this.router.url.includes("/task") ||
      this.router.url.includes("/project-person")) {
      this.subMenuQLHT = false
      this.subMenuQLNS = false
      this.subMenuLLV = false
      this.subMenuQLCV = true
    } else {
      this.subMenuQLNS = false
      this.subMenuLLV = false
      this.subMenuQLHT = false
      this.subMenuQLCV = false
    }
    if (document.body.offsetWidth <= 1024) {
      this.isCollapsed = true
    } else {
      this.isCollapsed = false
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.employeeName = userObject.userDetailName;
    this.userId = userObject.userDetailId;
    this.loadData();
  }

  parseJwt(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    console.log("//" + this.isCollapsed);
  }

  navigateToDetails = () => {
    this.router.navigate(['/infor-employee/' + this.userId], {state: {page: this.request}});
  };

  loadData(): void {
    this.listRolesMenuItem = this.loginService.getListRolesMenuItem();


    console.log('//', this.listRolesMenuItem[0]);

  }

}
