import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Filters,
  MainPathEndpoint,
  parseFilters,
  QueryParams,
  SubPathEndpoint,
  TrendsGeneralResponse,
  TrendsHumanRightsResponse,
  TrendsPeaceResponse,
} from 'src/utils';

import { TrendsService } from './trends.service';

@Controller(MainPathEndpoint.Trends)
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.General)
  async getGeneralData(
    @Query() query: QueryParams,
  ): Promise<TrendsGeneralResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.trendsService.findGeneralData(filters);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.Human_Rights)
  async getHumanRightsData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<TrendsHumanRightsResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.trendsService.findHumanRightsData(filters);
    return results;
  }

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.Peace)
  async getPeaceData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<TrendsPeaceResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.trendsService.findPeaceData(filters);
    return results;
  }
}
