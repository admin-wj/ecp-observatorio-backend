import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Filters,
  parseFilters,
  QueryParams,
  TrendsGeneralResponse,
  TrendsHumanRightsResponse,
  TrendsPeaceResponse,
} from 'src/utils';

import { TrendsService } from './trends.service';

@Controller('api/trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('general')
  async getGeneralData(
    @Query() query: QueryParams,
  ): Promise<TrendsGeneralResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.trendsService.findGeneralData(filters);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('human-rights')
  async getHumanRightsData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<TrendsHumanRightsResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.trendsService.findHumanRightsData(filters);
    return results;
  }

  @UseGuards(JwtAuthGuard)
  @Get('peace')
  async getPeaceData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<TrendsPeaceResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.trendsService.findPeaceData(filters);
    return results;
  }
}
