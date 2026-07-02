import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WorkoutLog } from '@oven/core'; // Proof of concept: importing from core

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  checkHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
