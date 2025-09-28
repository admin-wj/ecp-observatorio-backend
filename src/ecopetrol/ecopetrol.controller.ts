import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Filters, parseFilters, QueryParams } from 'src/common';

import {
  EcopetrolAffinityResponse,
  EcopetrolMaterialityResponse,
} from './ecopetrol.schema';
import { EcopetrolService } from './ecopetrol.service';

@Controller('api/ecopetrol')
export class EcopetrolController {
  constructor(private readonly ecopetrolService: EcopetrolService) {}

  @UseGuards(JwtAuthGuard)
  @Get('affinity')
  async getAffinityData(
    @Query() query: QueryParams,
  ): Promise<EcopetrolAffinityResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.ecopetrolService.findAffinityData(filters);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('materiality')
  async getMaterialityData(
    @Query() query: Record<string, string | string[]>,
  ): Promise<EcopetrolMaterialityResponse> {
    const filters: Filters = parseFilters(query);

    const results = await this.ecopetrolService.findMaterialityData(filters);
    return results;
  }
}
