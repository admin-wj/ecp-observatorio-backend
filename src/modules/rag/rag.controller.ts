import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
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
  RAGSendReportDto,
} from 'src/utils';

import { RAGService } from './rag.service';

@Controller(MainPathEndpoint.RAG)
export class RAGController {
  constructor(private readonly ragService: RAGService) {}

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.Summary)
  getSummaryData(@Query() dto: RAGSummaryDto): Promise<RAGSummaryResponse> {
    return this.ragService.findSummaryData(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(SubPathEndpoint.Report)
  async createReport(
    @Body() dto: RAGReportDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.headers['authorization'];
    const { buffer, filename, mimeType } = await this.ragService.createReport(
      dto,
      token,
    );

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Get(SubPathEndpoint.SendReport)
  sendReport(
    @Query() dto: RAGSendReportDto,
    @Req() req: Request,
  ): Promise<any> {
    const token = req.headers['authorization'];
    return this.ragService.sendReport(dto.endpoint, token);
  }
}
