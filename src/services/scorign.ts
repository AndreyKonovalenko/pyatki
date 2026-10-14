function isInLiquidation(res) {
  const status = res?.basic?.status ?? {};

  const method = {
    name: 'Юр.лицо находится в стадии ликвидации',
    result: false,
    id: '00000007',
  };

  if (status.egrulName === 'Находится в стадии ликвидации')
    method.result = true;
  if (status.name === 'В процессе ликвидации') method.result = true;

  return method.result;
}

function isFinancialReportExist(res) {
  // get_company_finacial_report

  const list = res?.indicators_list ?? [];
  const method = {
    name: 'Наличие сведений о финансовой отчетности компании за завершенный год, размещенной на внешних информационных ресурсах',
    result: Array.isArray(list) && list.length > 0,
    id: '00000023',
  };
}
