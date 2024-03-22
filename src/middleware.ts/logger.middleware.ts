import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    console.log(req.headers.host);
    next();
  }
}

//함수식으로도 선언가능
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
