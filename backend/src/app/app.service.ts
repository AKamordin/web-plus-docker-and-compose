import { Injectable } from '@nestjs/common';
import { APP_NAME } from '../constants';

@Injectable()
export class AppService {
  ping(): string {
    return `${APP_NAME}`;
  }
}
