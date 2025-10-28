import { RAGEndpoints } from '../enums';
import { FiltersValues } from './shared.types';

export type RAGSummaryDto = {
  query: string;
  endpoint: RAGEndpoints;
};

export type RAGReportDto = {
  data?: any;
  endpoint: RAGEndpoints;
  needsPastData?: boolean;
  searchParams?: Record<string, string>;
  filterValues?: FiltersValues;
  isWord?: boolean;
};

export type RAGSummaryResponse = {
  ragSummaries: Record<string, unknown>;
};

export type RAGReportData = {
  buffer: Buffer;
  filename: string;
  mimeType:
    | 'application/pdf'
    | 'application/pdfapplication/vnd.openxmlformats-officedocument.wordprocessingml.document';
};
