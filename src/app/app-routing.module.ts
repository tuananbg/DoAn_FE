import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import * as path from "path";
import {AuthLayoutComponent} from "./pages/layout/auth-layout/auth-layout.component";
import {RegisterComponent} from "./pages/layout/auth-layout/register/register.component";
import {MainLayoutComponent} from "./pages/layout/main-layout/main-layout.component";
import {UserManagermentComponent} from "./pages/HRM/user-managerment/user-managerment.component";
import {AccountManagementComponent} from "./pages/system/account-management/account-management.component";
import {SystemConfigComponent} from "./pages/system/system-config/system-config.component";
import { DepartmentManagermentComponent } from './pages/HRM/department/department-managerment/department-managerment.component';
import {LoginComponent} from "./pages/layout/auth-layout/login/login.component";
import {PositionManagermentComponent} from "./pages/HRM/position/position-managerment/position-managerment.component";
import {
  ListEmployeeManagermentComponent
} from "./pages/HRM/employee/list-employee-managerment/list-employee-managerment.component";
import {
  DetailEmployeeManagermentComponent
} from "./pages/HRM/employee/detail-employee-managerment/detail-employee-managerment.component";
import {
  ListContractManagermentComponent
} from "./pages/HRM/contract/list-contract-managerment/list-contract-managerment.component";
import {
  ListAttendanceManagermentComponent
} from "./pages/quanlychamcong/chamcong/list-attendance-managerment/list-attendance-managerment.component";
import {DashboardComponent} from "./pages/dashboard/dashboard/dashboard.component";
import {
  ListAttendanceLeaveComponent
} from "./pages/quanlychamcong/dangkylichnghiphep/list-attendance-leave/list-attendance-leave.component";
import {
  ListAttendanceOtComponent
} from "./pages/quanlychamcong/dangkylichOT/list-attendance-ot/list-attendance-ot.component";
import {ListWageManagermentComponent} from "./pages/HRM/wage/list-wage-managerment/list-wage-managerment.component";
import {DetailInforEmployeeComponent} from "./pages/HRM/employee/detail-infor-employee/detail-infor-employee.component";
import {ChangePasswordComponent} from "./pages/layout/auth-layout/change-password/change-password.component";
import {
  ProjectListManagementComponent
} from "./pages/quanlycongviec/project/project-list-management/project-list-management.component";
import {
  TaskBoardManagementComponent
} from "./pages/quanlycongviec/task-board-management/task-board-management.component";
import {TaskListManagementComponent} from "./pages/quanlycongviec/task-list-management/task-list-management.component";
import {
  CreateProjectManagementComponent
} from "./pages/quanlycongviec/project/create-project-management/create-project-management.component";
import {TaskFormManagementComponent} from "./pages/quanlycongviec/task-form-management/task-form-management.component";

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full'
      // },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'department',
        component: DepartmentManagermentComponent
      },
      {
        path: 'position',
        component: PositionManagermentComponent
      },
      {
        path: 'employee',
        component: ListEmployeeManagermentComponent
      },
      {
        path: 'infor-employee/:id',
        component: DetailInforEmployeeComponent
      },
      {
        path: 'detail-employee/:id',
        component: DetailEmployeeManagermentComponent
      },
      {
        path: 'contract',
        component: ListContractManagermentComponent
      },
      {
        path: 'wage',
        component: ListWageManagermentComponent
      },
      {
        path: 'attendance',
        component: ListAttendanceManagermentComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'account',
        component: AccountManagementComponent
      },
      {
        path: 'system',
        component: SystemConfigComponent
      },
      {
        path: 'user',
        component: UserManagermentComponent,
      },
      {
        path: 'attendanceleave',
        component: ListAttendanceLeaveComponent
      },
      {
        path: 'attendanceOt',
        component: ListAttendanceOtComponent
      },
      {
        path: 'project',
        component: ProjectListManagementComponent,
      },
      {
        path: 'project-person/:id',
        component: ProjectListManagementComponent
      },
      {
        path: 'project/add',
        component: CreateProjectManagementComponent
      },
      {
        path: 'project/detail/:id',
        component: CreateProjectManagementComponent
      },
      {
        path: 'task-board/:id',
        component: TaskBoardManagementComponent
      },
      {
        path: 'task-list',
        component: TaskListManagementComponent
      },
      {
        path: 'task/add/:projectId',
        component: TaskFormManagementComponent
      },
      {
        path: 'task/detail/:projectId/:taskId',
        component: TaskFormManagementComponent
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent
      }
    ]
  },
  {
    path:'**', redirectTo: '/exception'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
