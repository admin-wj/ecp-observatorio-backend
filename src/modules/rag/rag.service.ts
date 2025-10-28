import { Injectable } from '@nestjs/common';

import {
  getReportDates,
  ragAPICall,
  RAGReportDto,
  RAGSummaryResponse,
  RAGSummaryDto,
  getHTMLComponent,
  generatePDF,
  generateWord,
  RAGReportData,
  getFileFormattedDate,
  SubPathEndpoint,
  MainPathEndpoint,
} from 'src/utils';

@Injectable()
export class RAGService {
  constructor() {}

  async findSummaryData(dto: RAGSummaryDto): Promise<RAGSummaryResponse> {
    const { query, endpoint } = dto;

    const ragSummaries: Record<string, unknown> = await ragAPICall(
      'generate-summary',
      JSON.parse(query),
      endpoint,
    );

    return { ragSummaries };
  }

  async createReport(dto: RAGReportDto): Promise<RAGReportData> {
    const {
      data: currentData,
      endpoint,
      needsPastData,
      searchParams,
      filterValues,
      isWord,
    } = dto;

    let data: any;

    if (currentData) {
      data = currentData;
    } else {
      const currentParams = new URLSearchParams(getReportDates(endpoint));

      const dataResponse = await fetch(
        `${
          process.env.API_URL
        }/api/${endpoint}${`?${currentParams.toString()}`}`,
      );

      if (!dataResponse.ok) throw new Error(dataResponse.statusText);
      data = await dataResponse.json();
    }

    const ragReportData: any = await ragAPICall(
      'generate-report',
      data.fullQuery,
      endpoint,
      data,
    );

    let pastData;

    if (needsPastData) {
      const newSearchParams = searchParams ?? {
        ...getReportDates(endpoint),
        needs_past_data: 'true',
      };
      if (searchParams) newSearchParams.needs_past_data = 'true';
      const currentParams = new URLSearchParams(newSearchParams as any);

      const token = await fetch(
        `${process.env.API_URL}${process.env.PORT ? `:${process.env.PORT}` : ''}/api/${MainPathEndpoint.Auth}/${SubPathEndpoint.Get_Token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: process.env.INTERNAL_SECRET }),
        },
      );

      const { access_token } = await token.json();

      const dataResponse = await fetch(
        `${process.env.API_URL}${process.env.PORT ? `:${process.env.PORT}` : ''}/api/${endpoint.replaceAll('-', '/')}?${currentParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!dataResponse.ok) throw new Error(dataResponse.statusText);
      pastData = await dataResponse.json();
    }

    const htmlContent = await getHTMLComponent(
      endpoint,
      data,
      ragReportData,
      pastData,
      filterValues,
    );

    const baseFileName = `${endpoint}-${getFileFormattedDate(new Date())}`;

    if (isWord) {
      const buffer = await generateWord(htmlContent);
      const filename = `${baseFileName}.docx`;
      return {
        buffer,
        filename,
        mimeType:
          'application/pdfapplication/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    } else {
      const buffer = await generatePDF(htmlContent);
      const filename = `${baseFileName}.pdf`;
      return {
        buffer,
        filename,
        mimeType:
          'application/pdfapplication/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    }
  }
}
