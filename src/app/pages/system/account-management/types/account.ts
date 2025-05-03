export interface AccountSearchRequest {
  fullName: string
  email: string
  status: number
  active: number
}

export interface Role {
  code: string;
  name: string;
  active: boolean;
  isMaster: boolean;
  description: string;
}

export interface AccountSearchResponse {
  id: number;
  fullName: string;
  employeeCode: string;
  departmentName: string;
  positionName: string;
  email: string;
  status: number;
  active: number;
  role: Role[];
  createdDate: any;
  updatedDate: any;
}


export interface Permission {
  id: number;
  permissionCode: string;
  permissionName: string;
  status: number;
}

export interface MenuItem {
  id: number;
  menuItemCode: string;
  menuItemName: string;
  status: number;
  permissions: Permission[];
}

export interface Role {
  id: number;
  roleName: string;
  menuItems: MenuItem[];
}
