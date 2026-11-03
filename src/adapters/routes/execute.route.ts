import { METHOD_ENDPOINTS } from "../../cli/methods";
import type { App } from "../../app";
import type { RequestHandler } from "express";
import { isValidInn } from "../../utils/utils";
import { MAX_INNS_PER_CALL } from "../../domain/methods";

interface ExecuteBody {
  method?: string;
  inn?: string;
  year?: string;
}

export function executeRoute(app: App): RequestHandler {
    return async (req, res) => {
    const { method, inn, year } = req.body as ExecuteBody;
    console.log(req.body)

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

    try {
      const results: Array<{
        inn: string | null;
        result?: unknown;
        error?: string;
      }> = [];
      const targets: (string | null)[] = inns.length > 0 ? inns : [null];

      for (const element of targets) {
        try {
          const result = await app.api.get(METHOD_ENDPOINTS[method], {
            params: {
              ...(element && { inn: element }),
              ...(year && { year }),
            },
          });
          results.push({ inn: element, result });
        } catch (err) {
          results.push({
            inn: element,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
      res.json({ method, results });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}