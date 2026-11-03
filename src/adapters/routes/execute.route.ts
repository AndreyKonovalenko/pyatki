import { METHOD_ENDPOINTS } from "../../cli/methods";
import type { App } from "../../app";
import type { RequestHandler } from "express";
import { isValidInn } from "../../utils/utils";
import { MAX_INNS_PER_CALL } from "../../domain/methods";

interface ExecuteQuery {
  method?: string;
  inn?: string;
  year?: string;
}

export function executeRoute(app: App): RequestHandler {
    return async (req, res) => {
    const { method, inn, year } = req.query as ExecuteQuery;
  
    if (inn && !isValidInn(inn)) {
      return res.status(400).json({ error: 'Invalid INN' });
    }

    if (!method || !METHOD_ENDPOINTS[method]) {
      return res.status(400).json({ error: `Unknown method: ${method}` });
    }

    const inns = (inn ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

      // 3. Cap the batch
      if (inns.length > MAX_INNS_PER_CALL) {
        res.status(400).json({
          error: `Too many INNs: ${inns.length} > ${MAX_INNS_PER_CALL}`,
        });
        return;
       }

    const endpoint = METHOD_ENDPOINTS[method];
    const targets: (string | null)[] = inns.length > 0 ? inns : [null];
    const results: Array<{ inn: string | null; result?: unknown; error?: string }> = [];

    for (const singleInn of targets) {
      try {
        const result = await app.api.get(endpoint, {
          params: {
            ...(singleInn && { inn: singleInn }),
            ...(year && { year }),
          },
        });
        results.push({ inn: singleInn, result });
      } catch (err) {
        results.push({
          inn: singleInn,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    
    res.status(200).json({method, results})
  }
}