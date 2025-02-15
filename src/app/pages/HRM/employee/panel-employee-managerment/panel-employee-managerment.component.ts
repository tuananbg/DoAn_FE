import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {distinctUntilChanged, Subject, Subscription} from "rxjs";
import {Contact} from "../../../../core/contact";
import {ScreenService} from "../../../../service/screen.service";
import {DataService} from "../../../../service/data.service";
import {Router} from "@angular/router";
import {DxButtonTypes} from "devextreme-angular/ui/button";
import {EmployeeService} from "../../../../service/employee.service";
import {ToastService} from "../../../../service/toast.service";
import * as moment from "moment";
import {DepartmentService} from "../../../../service/department.service";
import {PositionService} from "../../../../service/position.service";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-panel-employee-managerment',
  templateUrl: './panel-employee-managerment.component.html',
  styleUrls: ['./panel-employee-managerment.component.less']
})
export class PanelEmployeeManagermentComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

  @Input() isOpened = false;
  @Input() isMarTop = false;
  @Input() isDisablePinClose = false;
  @Input() userId: any;
  @Output() isOpenedChange = new EventEmitter<boolean>();
  @Output() pinnedChange = new EventEmitter<boolean>();
  private pinEventSubject = new Subject<boolean>();
  user!: Contact;
  pinned = false;
  isLoading = true;
  isEditing = false;
  isPinEnabled = false;
  userPanelSubscriptions: Subscription[] = [];
  lstDepartment: any[] = [];
  lstPosition: any[] = [];
  payloadDepartment = {name: null, status: null};
  payloadPosition = {positionCode: null, positionName: null, isActive: 1};
  avatarFile!: File;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 0,
    name: null,
    size: 10, // -: desc | +: asc,
  };
  isUserOffice =  false;
  idUserDetail: any;

  constructor(private screen: ScreenService,
              private employeeService: EmployeeService,
              private toastService: ToastService,
              private departmentService: DepartmentService,
              private positionService: PositionService,
              private spinner: NgxSpinnerService,
              private router: Router) {
    this.userPanelSubscriptions.push(
      this.screen.changed.subscribe(this.calculatePin),
      this
        .pinEventSubject
        .pipe(distinctUntilChanged())
        .subscribe(this.pinnedChange)
    );
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.idUserDetail = userObject.userDetailId;
    this.calculatePin();
    this.fetchDepartment();
    this.fetchPosition();
  }

  ngAfterViewChecked(): void {
    this.pinEventSubject.next(this.pinned);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {userId} = changes;
    if (typeof userId.currentValue === 'number' && userId?.currentValue) {
      if( this.idUserDetail === userId.currentValue){
        this.isUserOffice = true;
      }else{
        this.isUserOffice = false;
      }
      this.loadUserById(userId.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.userPanelSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  loadUserById = (id: number) => {
    this.isLoading = true;
    this.employeeService.getEmployeeId(id).subscribe(res => {
      if (res && res.code === "OK") {
        this.user = res.data;
        this.user.birthday = moment(res.data.birthday).format('DD/MM/YYYY');
        this.isLoading = false;
        this.isEditing = false;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
    });
  };

  onClosePanel = () => {
    this.isOpened = false;
    this.pinned = false;
    this.isOpenedChange.emit(this.isOpened);
  };

  onPinClick = () => {
    this.pinned = !this.pinned;
  };

  onSaveClick = ({validationGroup}: DxButtonTypes.ClickEvent) => {
    if (!validationGroup.validate().isValid) return;
    const data = this.user;
    const avatarFile = this.avatarFile;
    if (this.isEditing) {
      this.spinner.show().then();
      this.employeeService.editEmployee(avatarFile, data).subscribe(res => {
        if (res && res.code === "OK") {
          this.toastService.openSuccessToast('Cập nhật nhân viên thành công');
          this.goBackHone();
          this.onClosePanel();
        } else {
          this.toastService.openErrorToast(res.msgCode);
        }
      }, error => {
        this.toastService.openErrorToast(error.error.msgCode);
        this.spinner.hide().then();
      }, () => {
        this.spinner.hide().then();
      });
    }
    this.isEditing = !this.isEditing;
  }

  calculatePin = () => {
    this.isPinEnabled = this.screen.sizes['screen-large'] || this.screen.sizes['screen-medium'];
    if (this.pinned && !this.isPinEnabled) {
      this.pinned = false;
    }
  };

  toggleEdit = () => {
    this.isEditing = !this.isEditing;
  };

  navigateToDetails = () => {
    this.router.navigate(['/detail-employee/' + this.userId], {state: {page: this.request}});
  };

  fetchDepartment() {
    this.departmentService.searchDepartment(this.payloadDepartment, {page: 0, size: -1}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstDepartment = response.data.content;
        this.lstDepartment.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
      }
    });
  }

  fetchPosition() {
    this.positionService.searchPosition(this.payloadPosition, {page: 0, size: -1}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstPosition = response.data.data;
        this.lstPosition.sort((a, b) => a.positionName.localeCompare(b.positionName));
      }
    });
  }

  onDepartmentChanged(event: any) {
    const selectedDepartmentId = event.value;
    this.positionService.searchPosition(this.payloadPosition, {page: 0, size: -1}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstPosition = response.data.data;
        this.lstPosition = this.lstPosition.filter(position => position.departmentId === selectedDepartmentId);
        this.lstPosition.sort((a, b) => a.positionName.localeCompare(b.positionName));
      }
    });
  }

  onValueChanged(e: any) {
    const files: File[] = e.value;
    if (files.length > 0) {
      this.avatarFile = files[0];
    }
  }

  goBackHone(){
    this.router.navigate(["/employee"]).then();
  }
}
