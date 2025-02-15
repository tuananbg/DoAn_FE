export interface UserSearchRequest {
  fullname: string
  gender: number | null
  birthday: string
  provinceId: number | null
  departmentId: number | null
  contract_createdate: string
  companyId: number | null
}

export interface UserSearchResponse {
  id: number | null
  email: string
  fullName: string
  gender: number
  birthday: string
  birthPlace: string
  address: string
  provinceName: string
  departmentName: string
  createdAt: string
  updatedAt: string
}

