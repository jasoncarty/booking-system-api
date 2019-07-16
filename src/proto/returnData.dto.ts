import { HttpStatus } from '@nestjs/common';

interface Data {
  data: object;
  token: string;
  status: HttpStatus;
}

export interface ReturnData {
  response: Data;
}
