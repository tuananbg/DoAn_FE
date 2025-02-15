export interface RegisterData {
  username: string
  email: string
  password: string
  company: CompanyData
}

interface CompanyData {
   companyViName: string
   companyEnName: string
   legalType: string
   taxCode: string
   address: string
   foundingDate: string
   representative: string
   website: string
   phone: string
}
