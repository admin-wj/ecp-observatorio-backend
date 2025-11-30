import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MainPathEndpoint } from 'src/utils';

import { LocationsService } from './locations.service';
import { Locations } from './locations.schema';

@Controller(MainPathEndpoint.Locations)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getLocationsData(): Promise<Locations[]> {
    return this.locationsService.findLocationsData();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getLocationsDataById(@Param('id') id: string): Promise<Locations> {
    return this.locationsService.findLocationsDataById(id);
  }
}
