export interface CompanyCardResponseDto {
  status?: ResponseStatusDto | null;
  company_card: CompanyCardDto | null;
}

export interface ResponseStatusDto {
  itemsFound?: number | null;
  methodStatus?: string | null;
  paramsCheckError?: CodeModelNumberDto | null;
  paramsAreValid?: boolean | null;
}

export interface CompanyCardDto {
  basic?: BasicDto | null;
  management?: ManagementDro | null;
  address?: string | null;
  addressFNS?: string | null;
  region_code?: string | null;
  companiesAtThisAdress?: number | null;
  IsMassAddrFNS?: boolean | null;
  registration?: RegistrationDto | null;
  registrationFNS?: RegistrationDto | null;
  contacts?: ContactsDto | null;
  kpp?: string | null;
  egrulCapital?: number | null;
  egrpoCapital?: number | null;
  okved_list?: OkvedDto[] | null;
  okved_list_2?: Okved2Dto[] | null;
  trustworthinessIndex?: FinancialIndexDto | null;
  financialStabilityIndex?: FinancialIndexDto | null;
  creditworthinessIndex?: FinancialIndexDto | null;
  badSupplier?: number | null;
  adress_tree?: AddressTreeNodeDto[] | null;
  OKPO?: string | null;
  OKATO?: CodeModelStringDto | null;
  OKFS?: CodeModelStringDto | null;
  OKOPF?: CodeModelStringDto | null;
  ORTMO?: CodeModelStringDto | null;
  OPF?: CodeModelStringDto | null;
  PF?: OrganCompanyInfoDto | null;
  FSS?: OrganCompanyInfoDto | null;
  SFR?: OrganCompanyInfoDto | null;
  MSP?: MspDto | null;
  FirstName?: string | null;
  IsDifferentAddress?: boolean | null;
  employeesFNS?: number | null;
}

export interface BasicDto {
  fullName?: string;
  shortName?: string;
  inn?: string;
  ogrn?: string;
  status?: UlStatusDto;
}

export interface UlStatusDto {
  regOrgan?: CodeModelStringDto | null;
  date?: string | null;
  egrulName?: string | null;
  code?: number | null;
  name?: string | null;
}

export interface ManagementDro {
  companies?: CeoCompanyDto[] | null;
  persons?: CeoPersonDto[] | null;
}

export interface CeoCompanyDto {
  person?: BasicDto | null;
  recordDate?: string | null;
  post?: string | null;
  massHead?: boolean | null;
  isMassHeadSeldon?: boolean | null;
  isMassHeadFNS?: boolean | null;
  massCoowner?: number | null;
  unreliabilityCeoInfo?: boolean | null;
  disqualificationStatus?: number | null;
}

export interface CeoPersonDto {
  person?: PersonDto | null;
  recordDate?: string | null;
  post?: string | null;
  massHead?: boolean | null;
  isMassHeadSeldon?: boolean | null;
  isMassHeadFNS?: boolean | null;
  massCoowner?: number | null;
  unreliabilityCeoInfo?: boolean | null;
  disqualificationStatus?: number | null;
}

export interface PersonDto {
  personId?: number | null;
  inn?: string | null;
  fullName?: string | null;
}

export interface RegistrationDto {
  regOrgan?: CodeModelNumberDto | null;
  date?: string | null;
}

export interface ContactsDto {
  phones?: PhoneDto[] | null;
  faxes?: unknown[] | null;
  emails?: EmailDto[] | null;
  sites?: SiteDto[] | null;
}

export interface PhoneDto {
  number?: string | null;
  numberFormated?: string | null;
  structure?: PhoneStructureDto | null;
  sourceCode?: number | null;
}

export interface PhoneStructureDto {
  country?: string | null;
  city?: string | null;
  number?: string | null;
  ext?: string | null;
}

export interface EmailDto {
  email?: string | null;
  sourceCode?: number | null;
}

export interface SiteDto {
  site?: string;
}

export interface OkvedDto {
  is_main?: boolean | null;
  code?: string | null;
  name?: string | null;
}

export interface Okved2Dto {
  code_type?: number | null;
  is_main?: boolean | null;
  code?: string | null;
  name?: string | null;
}

export interface FinancialIndexDto {
  value: number | null;
  descr: string | null;
}

export interface AddressTreeNodeDto {
  ident_id?: number | null;
  ident?: string | null;
  value?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  postal_code?: string | null;
}

export interface OrganCompanyInfoDto {
  code?: string | null;
  regOrgan?: CodeModelStringDto | null;
  date?: string | null;
}

export interface MspDto {
  type?: number | null;
}

export interface CodeModelStringDto {
  code?: string | null;
  name?: string | null;
}

export interface CodeModelNumberDto {
  code?: string | null;
  name?: string | null;
}
