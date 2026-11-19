import fs from 'fs';
import type { Logger } from '../models/ports';
import { CompanyOverviewUseCase } from './company-overview.usecase';
import { inputFileReader } from '../shared/input-file-reader';

import { mapWithLimit } from '../shared/concurrency';

export interface OverviewRecord {
  inn: string;
  shortName: string;
  status: string;
}

export interface BatchSummary {
  total: number;
  succeeded: number;
  failed: number;
  outputFilePath: string;
}

export type OverviewResult = Record<string, OverviewRecord>;

export async function runCompanyOverviewBatch(
  useCase: CompanyOverviewUseCase,
  logger: Logger,
  inputFilePath: string,
  outputFilePath: string,
  concurrency = 5,
): Promise<BatchSummary> {
  const inns = inputFileReader(inputFilePath);
  logger.info(`📦 Loaded ${inns.length} INNs from ${inputFilePath}`);

  const result: OverviewResult = {};
  let done = 0;

  const settled = await mapWithLimit(
    inns,
    concurrency,
    async (inn): Promise<OverviewRecord> => {
      try {
        const data = await useCase.run(inn);
        return { inn, shortName: data.shortName, status: data.status };
      } finally {
        done++;
        if (done % 10 === 0 || done === inns.length) {
          logger.info(` [${done}/${inns.length}]`);
        }
      }
    },
  );

  for (let i = 0; i < settled.length; i++) {
    const inn = inns[i];
    const r = settled[i];

    if (r.status === 'fulfilled') {
      result[inn] = r.value;
    } else {
      result[inn] = {
        inn,
        shortName: '',
        status: `ERROR: ${(r.reason as Error)?.message ?? 'unkonwn'}`,
      };
      logger.warn(`❌ ${inn}: ${(r.reason as Error)?.message ?? r.reason}`);
    }
  }
  fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));

  // Compute summary from the written data
  const records = Object.values(result);
  const failed = records.filter(r => r.status.startsWith('ERROR')).length;
  const summary: BatchSummary = {
    total: records.length,
    succeeded: records.length - failed,
    failed,
    outputFilePath,
  };

  logger.info(
    `✅ Wrote ${Object.keys(result).length} records to ${outputFilePath}`,
  );

  return summary;
}
