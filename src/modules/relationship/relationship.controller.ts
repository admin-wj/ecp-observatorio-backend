import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  RelationshipResponse,
  Filters,
  MainPathEndpoint,
  parseFilters,
  QueryParams,
} from 'src/utils';

import { RelationshipService } from './relationship.service';

@Controller(MainPathEndpoint.Relationship)
export class RelationshipController {
  constructor(private readonly relationshipService: RelationshipService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRelationshipData(
    @Query() query: QueryParams,
  ): Promise<RelationshipResponse> {
    const filters: Filters = parseFilters(query);
    const result = await this.relationshipService.findRelationshipData(filters);
    return result;
  }
}
