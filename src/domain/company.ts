export type CompanyStatusCode =
  | 'active'
  | 'liquidating'
  | 'liquidated'
  | 'reorganizing'
  | 'bunkrupt'
  | 'unknown';

export interface CompanySatus {
  code: CompanyStatusCode;
  label: string;
}

export interface Okved {
  code: string;
  name: string;
}

export interface Ceo {
  personId: number | null;
  inn: string;
  fullName: string;
  post: string;
  since: Date | null;
}

export interface Phone {
  raw: string;
  formatted: string;
}

export interface CompanyCard {
  inn: string;
  ogrn: string;
  kpp: string;
  fullName: string;
  shortName: string;
  status: CompanySatus;
  registerAt: Date | null;
  address: string;
  regionCode: string;
  employees: number;
  capital: number;
  isBadSupplier: boolean;
  isMassAdress: boolean;
  companiesAtThisAddress: number;
  mspType: number | null;
  mainOkved: Okved | null;
  ceo: Ceo | null;
  trustworthiness: number;
  financialStability: number;
  creditworthiness: number;
  phones: Phone[];
  emails: string[];
  sites: string[];
}
