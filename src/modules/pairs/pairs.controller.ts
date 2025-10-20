import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Filters,
  PairsAffinityResponse,
  PairsRankingResponse,
  parseFilters,
  QueryParams,
} from 'src/utils';

import { PairsService } from './pairs.service';

@Controller('api/pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('affinity')
  async getAffinityData(
    @Query() query: QueryParams,
  ): Promise<PairsAffinityResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.pairsService.findAffinityData(filters);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('ranking')
  async getRankingData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<PairsRankingResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.pairsService.findRankingData(filters);
    return results;
  }
}
