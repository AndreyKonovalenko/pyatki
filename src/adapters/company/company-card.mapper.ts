import type {
  CompanyCardResponseDto,
  CompanyCardDto,
  OkvedDto,
  Okved2Dto,
  PersonDto,
  PhoneDto,
} from './company-card.dto';

import type {
  CompanyCard,
  Okved,
  Ceo,
  Phone,
  CompanySatus,
} from '../../domain/company';

export function toCompanyCard(res: CompanyCardResponseDto): CompanyCard {
  const card = res.company_card;
  if (!card) {
    throw new Error('Company card missing in API response');
  }

  return {
    inn: card.basic?.inn ?? '',
    ogrn: card.basic?.ogrn ?? '',
    kpp: card.kpp ?? '',
    fullName: card.FirstName ?? '',
    shortName: card.basic?.shortName ?? '',
    status: toStatus(card.basic?.status?.code, card.basic?.status?.name),
    registerAt: parseDate(card.registration?.date),
    address: card.address ?? '',
    regionCode: card.region_code ?? '',
    employees: card.employeesFNS ?? 0,
    capital: card.egrulCapital ?? 0,
    isBadSupplier: (card.badSupplier ?? 0) > 0,
    isMassAdress: card.IsMassAddrFNS ?? false,
    companiesAtThisAddress: card.companiesAtThisAdress ?? 0,
    mspType: card.MSP?.type ?? null,
    mainOkved: mainOkved(card.okved_list_2),
    ceo: getCeo(card),
    trustworthiness: card.trustworthinessIndex?.value ?? 0,
    financialStability: card.finacialStabilityIndex?.value ?? 0,
    creditworthiness: card.creditworthinessIndex?.value ?? 0,
    phones: (card.contacts?.phones ?? []).map(toPhone),
    emails: (card.contacts?.emails ?? []).map(e => e.email ?? ''),
    sites: (card.contacts?.sites ?? []).map(s => s.site ?? ''),
  };
}

export function toCompanyCards(
  responses: CompanyCardResponseDto[],
): CompanyCard[] {
  return responses.filter(r => r.company_card != null).map(toCompanyCard);
}

function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function toStatus(
  code: number | null | undefined,
  name: string | null | undefined,
): CompanySatus {
  const label = name ?? 'Неизветсно';
  switch (code) {
    case 11:
      return { code: 'active', label };
    case 12:
      return { code: 'liquidating', label };
    case 13:
      return { code: 'liquidated', label };
    case 14:
      return { code: 'reorganizing', label };
    case 15:
      return { code: 'unknown', label };
    default:
      return { code: 'unknown', label };
  }
}

function mainOkved(okveds: Okved2Dto[] | null | undefined): Okved | null {
  if (!okveds?.length) return null;
  const main = okveds.find(o => o.is_main) ?? okveds[0];
  return { code: main.code ?? '', name: main.name ?? '' };
}

function getCeo(card: CompanyCardDto): Ceo | null {
  const entry = card.management?.persons?.[0];
  const person = entry?.person;
  if (!person) return null;
  return {
    personId: person.personId ?? null,
    inn: person.inn ?? '',
    fullName: person.fullName ?? '',
    post: entry?.post ?? '',
    since: parseDate(entry?.recordDate),
  };
}

function toPhone(p: PhoneDto): Phone {
  return {
    raw: p.number ?? '',
    formatted: p.numberFormated ?? p.number ?? '',
  };
}
