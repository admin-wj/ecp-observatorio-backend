import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  EcopetrolAffinityResponse,
  EcopetrolMaterialityResponse,
  Filters,
  MainPathEndpoint,
  parseFilters,
  QueryParams,
  SubPathEndpoint,
} from 'src/utils';

import { EcopetrolService } from './ecopetrol.service';

@Controller(MainPathEndpoint.Ecopetrol)
export class EcopetrolController {
  constructor(private readonly ecopetrolService: EcopetrolService) {}

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.Affinity)
  async getAffinityData(
    @Query() query: QueryParams,
  ): Promise<EcopetrolAffinityResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.ecopetrolService.findAffinityData(filters);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.Materiality)
  async getMaterialityData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<EcopetrolMaterialityResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.ecopetrolService.findMaterialityData(filters);
    return results;
  }
}
