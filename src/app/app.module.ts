import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NZ_I18N, NzI18nModule} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import { AuthLayoutComponent } from './pages/layout/auth-layout/auth-layout.component';
import { RegisterComponent } from './pages/layout/auth-layout/register/register.component';
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzNotificationService} from "ng-zorro-antd/notification";
import { MainLayoutComponent } from './pages/layout/main-layout/main-layout.component';
import { HeaderComponent } from './pages/components/header/header.component';
import {NzImageModule} from "ng-zorro-antd/experimental/image";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import { SideBarComponent } from './pages/components/side-bar/side-bar.component';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NZ_ICONS, NzIconModule} from "ng-zorro-antd/icon";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import { UserManagermentComponent } from './pages/HRM/user-managerment/user-managerment.component';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {AccountManagementComponent} from "./pages/system/account-management/account-management.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import { SystemConfigComponent } from './pages/system/system-config/system-config.component';
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzTransferModule} from "ng-zorro-antd/transfer";
import {NzTagModule} from "ng-zorro-antd/tag";
import { DepartmentManagermentComponent } from './pages/HRM/department/department-managerment/department-managerment.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { LoadingComponent } from './pages/components/loading/loading/loading.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { InputTextV2Component } from './pages/components/inputs/input-text-v2/input-text-v2.component';
import { InlineMessageComponent } from './pages/components/inline-message/inline-message/inline-message.component';
import { SelectComponent } from './pages/components/selects/select/select.component';
import { LabelVerticalComponent } from './pages/components/labels/label-vertical/label-vertical.component';
import { LabelHorizontalComponent } from './pages/components/labels/label-horizontal/label-horizontal.component';
import { ButtonCommonComponent } from './pages/components/buttons/button-common/button-common/button-common.component';
import { ButtonBaseComponent } from './pages/components/buttons/button-base/button-base/button-base.component';
import { ButtonCancelComponent } from './pages/components/buttons/button-cancel/button-cancel/button-cancel.component';
import { ButtonCreateComponent } from './pages/components/buttons/button-create/button-create/button-create.component';
import { ButtonExportComponent } from './pages/components/buttons/button-export/button-export/button-export.component';
import { ModalConfirmComponent } from './pages/components/modals/modal-confirm/modal-confirm/modal-confirm.component';
import { CreateDepartmentComponent } from './pages/HRM/department/create-department/create-department.component';
import { ButtonSaveComponent } from './pages/components/buttons/button-save/button-save/button-save.component';
import { ButtonIconComponent } from './pages/components/buttons/button-icon/button-icon/button-icon.component';
import { PagingComponent } from './pages/components/paging/paging/paging.component';
import {ToastrModule} from "ngx-toastr";
import {NgxSpinnerModule} from "ngx-spinner";
import { FooterComponent } from './pages/components/footer/footer/footer.component';
import {NzModalModule} from "ng-zorro-antd/modal";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { ButtonConfirmComponent } from './pages/components/buttons/button-confirm/button-confirm.component';
import { ButtonDeleteComponent } from './pages/components/buttons/button-delete/button-delete.component';
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import { LoginComponent } from './pages/layout/auth-layout/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { PositionManagermentComponent } from './pages/HRM/position/position-managerment/position-managerment.component';
import { PositionManagermentFormComponent } from './pages/HRM/position/position-managerment-form/position-managerment-form.component';
import { InputTextareaV2Component } from './pages/components/inputs/input-textarea-v2/input-textarea-v2.component';
import { ListEmployeeManagermentComponent } from './pages/HRM/employee/list-employee-managerment/list-employee-managerment.component';
import { DetailEmployeeManagermentComponent } from './pages/HRM/employee/detail-employee-managerment/detail-employee-managerment.component';

import {
  DevExtremeModule,
  DxAccordionModule, DxBulletModule,
  DxCalendarModule, DxChartModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownButtonModule,
  DxFileUploaderModule,
  DxFormModule,
  DxLoadPanelModule,
  DxNumberBoxModule, DxPieChartModule,
  DxPopupModule, DxRangeSelectorModule, DxSchedulerModule,
  DxSelectBoxModule, DxSpeedDialActionModule,
  DxTabPanelModule, DxTabsModule, DxTextAreaModule,
  DxTextBoxModule,
  DxToolbarModule, DxTooltipModule,
  DxValidationGroupModule,
  DxValidatorModule
} from "devextreme-angular";
import { FormEmployeeManagermentComponent } from './pages/HRM/employee/form-employee-managerment/form-employee-managerment.component';
import { FormPopupComponent } from './pages/components/form-popup/form-popup.component';
import {ApplyPipeModule} from "./pipes/apply.pipe";
import {PhonePipeModule} from "./pipes/phone.pipe";
import { FormTextboxComponent } from './pages/components/form-textbox/form-textbox.component';
import { TransferState } from '@angular/platform-browser';
import { PanelEmployeeManagermentComponent } from './pages/HRM/employee/panel-employee-managerment/panel-employee-managerment.component';
import { FormPhotoComponent } from './pages/components/form-photo/form-photo.component';
import { ContactFormComponent } from './pages/components/contact-form/contact-form.component';
import { ToolbarFormComponent } from './pages/components/toolbar-form/toolbar-form.component';
import { ContactCardsComponent } from './pages/components/contact-cards/contact-cards.component';
import { CardTasksComponent } from './pages/components/card-tasks/card-tasks.component';
import { FormPhotoUploaderComponent } from './pages/components/form-photo-uploader/form-photo-uploader.component';
import { InformationFlowComponent } from './pages/HRM/information-flow/information-flow.component';
import { ListQualificationManagerComponent } from './pages/HRM/qualification/list-qualification-manager/list-qualification-manager.component';
import { DetailQualificationManagerComponent } from './pages/HRM/qualification/detail-qualification-manager/detail-qualification-manager.component';
import { DatePickerComponent } from './pages/components/date/date-picker/date-picker.component';
import { ListSocialinsuranceManagermentComponent } from './pages/HRM/socialinsurance/list-socialinsurance-managerment/list-socialinsurance-managerment.component';
import { FormSocialinsuranceManagermentComponent } from './pages/HRM/socialinsurance/form-socialinsurance-managerment/form-socialinsurance-managerment.component';
import { ListContractManagermentComponent } from './pages/HRM/contract/list-contract-managerment/list-contract-managerment.component';
import { FormContractManagermentComponent } from './pages/HRM/contract/form-contract-managerment/form-contract-managerment.component';
import { UploadFileAttachmentComponent } from './pages/components/upload-file-attachment/upload-file-attachment.component';
import {NzUploadModule} from "ng-zorro-antd/upload";
import { ListContractForEmployeeComponent } from './pages/HRM/contract/list-contract-for-employee/list-contract-for-employee.component';
import { FormContractForEmployeeComponent } from './pages/HRM/contract/form-contract-for-employee/form-contract-for-employee.component';
import {DefaultInterceptor} from "./pages/layout/auth-layout/net/default.interceptor";
import { ListAttendanceManagermentComponent } from './pages/quanlychamcong/chamcong/list-attendance-managerment/list-attendance-managerment.component';
import { RightSidePanelComponent } from './pages/components/right-side-panel/right-side-panel.component';
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import { PanelAttendanceManagermentComponent } from './pages/quanlychamcong/chamcong/panel-attendance-managerment/panel-attendance-managerment.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { TickerCardComponent } from './pages/components/ticker-card/ticker-card.component';
import { ToolbarAnalyticsComponent } from './pages/components/toolbar-analytics/toolbar-analytics.component';
import { SalesByRangeCardComponent } from './pages/components/sales-by-range-card/sales-by-range-card.component';
import { CardAnalyticsComponent } from './pages/components/card-analytics/card-analytics.component';
import { TimeoffAnalysisCardComponent } from './pages/components/timeoff-analysis-card/timeoff-analysis-card.component';
import { ContractAnalysisCardComponent } from './pages/components/contract-analysis-card/contract-analysis-card.component';
import { ListAttendanceLeaveComponent } from './pages/quanlychamcong/dangkylichnghiphep/list-attendance-leave/list-attendance-leave.component';
import { FormAttendanceLeaveComponent } from './pages/quanlychamcong/dangkylichnghiphep/form-attendance-leave/form-attendance-leave.component';
import { ListAttendanceOtComponent } from './pages/quanlychamcong/dangkylichOT/list-attendance-ot/list-attendance-ot.component';
import {
  FormAttendanceOtComponent
} from "./pages/quanlychamcong/dangkylichOT/form-attendance-ot/form-attendance-ot.component";
import { TimePickerComponent } from './pages/components/date/time-picker/time-picker.component';
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import { ListWageManagermentComponent } from './pages/HRM/wage/list-wage-managerment/list-wage-managerment.component';
import { FormWageManagermentComponent } from './pages/HRM/wage/form-wage-managerment/form-wage-managerment.component';
import { ListWageForEmployeeComponent } from './pages/HRM/wage/list-wage-for-employee/list-wage-for-employee.component';
import { FormWageForEmployeeComponent } from './pages/HRM/wage/form-wage-for-employee/form-wage-for-employee.component';
import { DetailInforEmployeeComponent } from './pages/HRM/employee/detail-infor-employee/detail-infor-employee.component';
import { ActionComponentDirective } from './shared/directives/action-component.directive';
import {ChangePasswordComponent} from "./pages/layout/auth-layout/change-password/change-password.component";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import { FormAccountManagementComponent } from './pages/system/form-account-management/form-account-management.component';
import { TaskBoardManagementComponent } from './pages/quanlycongviec/task-board-management/task-board-management.component';
import { TaskListManagementComponent } from './pages/quanlycongviec/task-list-management/task-list-management.component';
import { ProjectListManagementComponent } from './pages/quanlycongviec/project/project-list-management/project-list-management.component';
import { TaskDetailManagementComponent } from './pages/quanlycongviec/task-detail-management/task-detail-management.component';
import { TaskKanbanCardComponent } from './pages/components/task-kanban-card/task-kanban-card.component';
import { TaskFormManagementComponent } from './pages/quanlycongviec/task-form-management/task-form-management.component';
import { TaskListGridComponent } from './pages/quanlycongviec/task-list-grid/task-list-grid.component';
import { StatusIndicatorComponent } from './pages/components/status-indicator/status-indicator.component';
import { CreateProjectManagementComponent } from './pages/quanlycongviec/project/create-project-management/create-project-management.component';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxSortableModule } from 'devextreme-angular/ui/sortable';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { PopUpImgComponent } from './pages/components/pop-up-img/pop-up-img.component';

registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

const INTERCEPTOR_PROVIDES = [
  {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
];

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    RegisterComponent,
    MainLayoutComponent,
    HeaderComponent,
    SideBarComponent,
    UserManagermentComponent,
    AccountManagementComponent,
    SystemConfigComponent,
    DepartmentManagermentComponent,
    LoadingComponent,
    InputTextV2Component,
    InlineMessageComponent,
    SelectComponent,
    LabelVerticalComponent,
    LabelHorizontalComponent,
    ButtonCommonComponent,
    ButtonBaseComponent,
    ButtonCancelComponent,
    ButtonCreateComponent,
    ButtonExportComponent,
    ModalConfirmComponent,
    CreateDepartmentComponent,
    ButtonSaveComponent,
    ButtonIconComponent,
    PagingComponent,
    FooterComponent,
    ButtonConfirmComponent,
    ButtonDeleteComponent,
    LoginComponent,
    PositionManagermentComponent,
    PositionManagermentFormComponent,
    InputTextareaV2Component,
    ListEmployeeManagermentComponent,
    DetailEmployeeManagermentComponent,
    FormEmployeeManagermentComponent,
    FormPopupComponent,
    FormTextboxComponent,
    PanelEmployeeManagermentComponent,
    FormPhotoComponent,
    ContactFormComponent,
    ToolbarFormComponent,
    ContactCardsComponent,
    CardTasksComponent,
    FormPhotoUploaderComponent,
    InformationFlowComponent,
    ListQualificationManagerComponent,
    DetailQualificationManagerComponent,
    DatePickerComponent,
    ListSocialinsuranceManagermentComponent,
    FormSocialinsuranceManagermentComponent,
    ListContractManagermentComponent,
    FormContractManagermentComponent,
    UploadFileAttachmentComponent,
    ListContractForEmployeeComponent,
    FormContractForEmployeeComponent,
    ListAttendanceManagermentComponent,
    RightSidePanelComponent,
    PanelAttendanceManagermentComponent,
    DashboardComponent,
    TickerCardComponent,
    ToolbarAnalyticsComponent,
    SalesByRangeCardComponent,
    CardAnalyticsComponent,
    TimeoffAnalysisCardComponent,
    ContractAnalysisCardComponent,
    ListAttendanceLeaveComponent,
    FormAttendanceLeaveComponent,
    ListAttendanceOtComponent,
    FormAttendanceOtComponent,
    TimePickerComponent,
    ListWageManagermentComponent,
    FormWageManagermentComponent,
    ListWageForEmployeeComponent,
    FormWageForEmployeeComponent,
    DetailInforEmployeeComponent,
    ActionComponentDirective,
    ChangePasswordComponent,
    FormAccountManagementComponent,
    TaskBoardManagementComponent,
    TaskListManagementComponent,
    TaskDetailManagementComponent,
    TaskKanbanCardComponent,
    TaskFormManagementComponent,
    TaskListGridComponent,
    StatusIndicatorComponent,
    ProjectListManagementComponent,
    CreateProjectManagementComponent,
    PopUpImgComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule,
        NzLayoutModule,
        NzCardModule,
        NzFormModule,
        NzStepsModule,
        NzButtonModule,
        NzInputModule,
        NzSelectModule,
        NzImageModule,
        NzAvatarModule,
        NzMenuModule,
        NzIconModule,
        NzToolTipModule,
        NzBreadCrumbModule,
        NzCollapseModule,
        NzDropDownModule,
        NzTableModule,
        NzTypographyModule,
        NzTabsModule,
        NzRadioModule,
        NzTransferModule,
        NzTagModule,
        NzDatePickerModule,
        NzSpinModule,
        NzModalModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        NzPopconfirmModule,
        MatCardModule,
        MatButtonModule,
        DxDataGridModule,
        DxButtonModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxPopupModule,
        DxValidationGroupModule,
        ApplyPipeModule,
        PhonePipeModule,
        DxFormModule,
        DxValidatorModule,
        DxToolbarModule,
        DxScrollViewModule,
        DxAccordionModule,
        DxLoadPanelModule,
        DxFileUploaderModule,
        DxDropDownButtonModule,
        DxNumberBoxModule,
        DxTabPanelModule,
        DxDateBoxModule,
        NzUploadModule,
        DxCalendarModule,
        DxSchedulerModule,
        DxTooltipModule,
        DxSpeedDialActionModule,
        NzDrawerModule,
        DxPieChartModule,
        DxChartModule,
        NzTimePickerModule,
        NzPaginationModule,
        DxSortableModule,
        DxTabsModule,
        DxBulletModule,
        DxRangeSelectorModule,
        DxTextAreaModule,
        ReactiveFormsModule,
        NzCheckboxModule,
        CKEditorModule,
    ],
  providers: [{provide: NZ_I18N, useValue: [en_US]},
    { provide: NZ_ICONS, useValue: icons },
    NzNotificationService,
    TransferState,
    INTERCEPTOR_PROVIDES],
  bootstrap: [AppComponent]
})
export class AppModule {
}
function provideAnimations(): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}

