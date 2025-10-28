import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  MainPathEndpoint,
  RAGReportDto,
  RAGSummaryResponse,
  RAGSummaryDto,
  SubPathEndpoint,
} from 'src/utils';

import { RAGService } from './rag.service';

@Controller(MainPathEndpoint.RAG)
export class RAGController {
  constructor(private readonly ragService: RAGService) {}

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.Summary)
  async getSummaryData(@Query() dto: RAGSummaryDto): Promise<RAGSummaryResponse> {
    const result = await this.ragService.findSummaryData(dto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('report')
  async createReport(@Body() dto: RAGReportDto, @Res() res: Response) {
    const { buffer, filename, mimeType } =
      await this.ragService.createReport(dto);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }
}
