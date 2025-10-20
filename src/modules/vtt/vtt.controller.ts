import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Filters,
  parseFilters,
  QueryParams,
  VTTDailyResponse,
  VTTDemandsResponse,
  VTTNewsResponse,
} from 'src/utils';

import { VTTService } from './vtt.service';

@Controller('api/vtt')
export class VTTController {
  constructor(private readonly vttService: VTTService) {}

  @UseGuards(JwtAuthGuard)
  @Get('news')
  async getNewsData(@Query() query: QueryParams): Promise<VTTNewsResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.vttService.findNewsData(filters);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('demands')
  async getDemandsData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<VTTDemandsResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.vttService.findDemandsData(filters);
    return results;
  }

  @UseGuards(JwtAuthGuard)
  @Get('daily')
  async getDailyData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<VTTDailyResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.vttService.findDailyData(filters);
    return results;
  }
}
