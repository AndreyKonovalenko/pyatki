'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.toCompanyCard = toCompanyCard;
exports.toCompanyCards = toCompanyCards;
function toCompanyCard(res) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x,
    _y,
    _z,
    _0,
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
    _9;
  const card = res.company_card;
  if (!card) {
    throw new Error('Company card missing in API response');
  }
  return {
    inn:
      (_b = (_a = card.basic) === null || _a === void 0 ? void 0 : _a.inn) !==
        null && _b !== void 0
        ? _b
        : '',
    ogrn:
      (_d = (_c = card.basic) === null || _c === void 0 ? void 0 : _c.ogrn) !==
        null && _d !== void 0
        ? _d
        : '',
    kpp: (_e = card.kpp) !== null && _e !== void 0 ? _e : '',
    fullName: (_f = card.FirstName) !== null && _f !== void 0 ? _f : '',
    shortName:
      (_h =
        (_g = card.basic) === null || _g === void 0 ? void 0 : _g.shortName) !==
        null && _h !== void 0
        ? _h
        : '',
    status: toStatus(
      (_k =
        (_j = card.basic) === null || _j === void 0 ? void 0 : _j.status) ===
        null || _k === void 0
        ? void 0
        : _k.code,
      (_m =
        (_l = card.basic) === null || _l === void 0 ? void 0 : _l.status) ===
        null || _m === void 0
        ? void 0
        : _m.name,
    ),
    registerAt: parseDate(
      (_o = card.registration) === null || _o === void 0 ? void 0 : _o.date,
    ),
    address: (_p = card.address) !== null && _p !== void 0 ? _p : '',
    regionCode: (_q = card.region_code) !== null && _q !== void 0 ? _q : '',
    employees: (_r = card.employeesFNS) !== null && _r !== void 0 ? _r : 0,
    capital: (_s = card.egrulCapital) !== null && _s !== void 0 ? _s : 0,
    isBadSupplier:
      ((_t = card.badSupplier) !== null && _t !== void 0 ? _t : 0) > 0,
    isMassAdress:
      (_u = card.IsMassAddrFNS) !== null && _u !== void 0 ? _u : false,
    companiesAtThisAddress:
      (_v = card.companiesAtThisAdress) !== null && _v !== void 0 ? _v : 0,
    mspType:
      (_x = (_w = card.MSP) === null || _w === void 0 ? void 0 : _w.type) !==
        null && _x !== void 0
        ? _x
        : null,
    mainOkved: mainOkved(card.okved_list_2),
    ceo: getCeo(card),
    trustworthiness:
      (_z =
        (_y = card.trustworthinessIndex) === null || _y === void 0
          ? void 0
          : _y.value) !== null && _z !== void 0
        ? _z
        : 0,
    financialStability:
      (_1 =
        (_0 = card.finacialStabilityIndex) === null || _0 === void 0
          ? void 0
          : _0.value) !== null && _1 !== void 0
        ? _1
        : 0,
    creditworthiness:
      (_3 =
        (_2 = card.creditworthinessIndex) === null || _2 === void 0
          ? void 0
          : _2.value) !== null && _3 !== void 0
        ? _3
        : 0,
    phones: ((_5 =
      (_4 = card.contacts) === null || _4 === void 0 ? void 0 : _4.phones) !==
      null && _5 !== void 0
      ? _5
      : []
    ).map(toPhone),
    emails: ((_7 =
      (_6 = card.contacts) === null || _6 === void 0 ? void 0 : _6.emails) !==
      null && _7 !== void 0
      ? _7
      : []
    ).map(e => {
      var _a;
      return (_a = e.email) !== null && _a !== void 0 ? _a : '';
    }),
    sites: ((_9 =
      (_8 = card.contacts) === null || _8 === void 0 ? void 0 : _8.sites) !==
      null && _9 !== void 0
      ? _9
      : []
    ).map(s => {
      var _a;
      return (_a = s.site) !== null && _a !== void 0 ? _a : '';
    }),
  };
}
function toCompanyCards(responses) {
  return responses.filter(r => r.company_card != null).map(toCompanyCard);
}
function parseDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}
function toStatus(code, name) {
  const label = name !== null && name !== void 0 ? name : 'Неизветсно';
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
function mainOkved(okveds) {
  var _a, _b, _c;
  if (!(okveds === null || okveds === void 0 ? void 0 : okveds.length))
    return null;
  const main =
    (_a = okveds.find(o => o.is_main)) !== null && _a !== void 0
      ? _a
      : okveds[0];
  return {
    code: (_b = main.code) !== null && _b !== void 0 ? _b : '',
    name: (_c = main.name) !== null && _c !== void 0 ? _c : '',
  };
}
function getCeo(card) {
  var _a, _b, _c, _d, _e, _f;
  const entry =
    (_b =
      (_a = card.management) === null || _a === void 0
        ? void 0
        : _a.persons) === null || _b === void 0
      ? void 0
      : _b[0];
  const person = entry === null || entry === void 0 ? void 0 : entry.person;
  if (!person) return null;
  return {
    personId: (_c = person.personId) !== null && _c !== void 0 ? _c : null,
    inn: (_d = person.inn) !== null && _d !== void 0 ? _d : '',
    fullName: (_e = person.fullName) !== null && _e !== void 0 ? _e : '',
    post:
      (_f = entry === null || entry === void 0 ? void 0 : entry.post) !==
        null && _f !== void 0
        ? _f
        : '',
    since: parseDate(
      entry === null || entry === void 0 ? void 0 : entry.recordDate,
    ),
  };
}
function toPhone(p) {
  var _a, _b, _c;
  return {
    raw: (_a = p.number) !== null && _a !== void 0 ? _a : '',
    formatted:
      (_c =
        (_b = p.numberFormated) !== null && _b !== void 0 ? _b : p.number) !==
        null && _c !== void 0
        ? _c
        : '',
  };
}
