import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  check() {
    return { status: 'awake' };
  }
}
