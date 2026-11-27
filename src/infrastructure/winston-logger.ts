import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import type { Logger } from "../models/ports";

export class  WinstonLogger implements Logger {
  private logger: winston.Logger;
 
  constructor(logDir: string){
    const rotateTransoprt = new DailyRotateFile({
      dirname: logDir, 
      filename:'outbound-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    });
  
    rotateTransoprt.on('error', (err) => {
      console.error('Winston rotate transport error', err);
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        // winston.format((info) => {
        //   const redactKeys = ['password', 'token', 'authorization', 'cookie'];
        //   const redact = (obj: any) => {
        //     if (!obj || typeof obj !== 'object') return;
        //     for (const key of Object.keys(obj)) {
        //       if (redactKeys.includes(key.toLowerCase())) {
        //         obj[key] = '[REDACTED]';
        //       } else if (typeof obj[key] === 'object') {
        //         redact(obj[key]);
        //       }
        //     }
        //   };
        //   // Redact the entire info object (message + metadata)
        //   redact(info);
        //   return info;
        // })(), 
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [rotateTransoprt]
    });
  }
  info(msg: string): void {this.logger.info(msg);}
  warn(msg: string): void {this.logger.warn(msg);}
  error(msg: string): void {this.logger.error(msg)}
  debug(msg: string): void {this.logger.debug(msg)}
}