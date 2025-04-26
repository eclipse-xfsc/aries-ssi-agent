import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
  /**
   * Check if app is running
   *
   * @returns - OK (200) if app is running
   */
  @Get()
  public getHealth() {
    return {
      statusCode: HttpStatus.OK,
      message: `${new Date()}`,
    };
  }
}
