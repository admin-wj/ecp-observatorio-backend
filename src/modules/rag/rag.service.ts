import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';

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
  RAGEndpoints,
  parseFilters,
  Filters,
} from 'src/utils';

import { EcopetrolService } from '../ecopetrol/ecopetrol.service';
import { PairsService } from '../pairs/pairs.service';
import { RelationshipService } from '../relationship/relationship.service';
import { TrendsService } from '../trends/trends.service';
import { VTTService } from '../vtt/vtt.service';

@Injectable()
export class RAGService {
  constructor(
    private readonly ecopetrolService: EcopetrolService,
    private readonly pairsService: PairsService,
    private readonly relationshipService: RelationshipService,
    private readonly trendsService: TrendsService,
    private readonly vttService: VTTService,
  ) {}

  async findSummaryData(dto: RAGSummaryDto): Promise<RAGSummaryResponse> {
    const { query, endpoint } = dto;

    const ragSummaries: Record<string, unknown> = await ragAPICall(
      'generate-summary',
      JSON.parse(query),
      endpoint,
    );

    return ragSummaries;
  }

  async createReport(dto: RAGReportDto, token: string): Promise<RAGReportData> {
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
      const queryParams = getReportDates(endpoint);
      data = await this.getDataForEndpoint(endpoint, queryParams);
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

      pastData = await this.getDataForEndpoint(endpoint, newSearchParams);
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
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    } else {
      const buffer = await generatePDF(htmlContent);
      const filename = `${baseFileName}.pdf`;
      return {
        buffer,
        filename,
        mimeType: 'application/pdf',
      };
    }
  }

  private async getDataForEndpoint(
    endpoint: RAGEndpoints,
    queryParams: any,
  ): Promise<any> {
    const filters: Filters = parseFilters(queryParams);

    switch (endpoint) {
      case RAGEndpoints.Ecopetrol_Affinity:
        return this.ecopetrolService.findAffinityData(filters);
      case RAGEndpoints.Ecopetrol_Materiality:
        return this.ecopetrolService.findMaterialityData(filters);
      case RAGEndpoints.Pairs_Affinity:
        return this.pairsService.findAffinityData(filters);
      case RAGEndpoints.Pairs_Ranking:
        return this.pairsService.findRankingData(filters);
      case RAGEndpoints.Trends_Human_Rights:
        return this.trendsService.findHumanRightsData(filters);
      case RAGEndpoints.Trends_Peace:
        return this.trendsService.findPeaceData(filters);
      case RAGEndpoints.VTT_News:
        return this.vttService.findNewsData(filters);
      case RAGEndpoints.VTT_Demands:
        return this.vttService.findDemandsData(filters);
      case RAGEndpoints.VTT_Daily:
        return this.vttService.findDailyData(filters);
      case RAGEndpoints.Relationship:
        return this.relationshipService.findRelationshipData(filters);
      default:
        throw new Error(`Endpoint ${endpoint} not supported`);
    }
  }

  async sendReport(endpoint: RAGEndpoints, token: string): Promise<void> {
    const FormData = require('form-data');
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
    });

    let needsPastData = false;
    let subject = 'Oceana - Reporte VTT Gestión Diaria';
    let reportName = 'VTT Gestión Diaria';
    const to = [
      'Nohora Galan <galan.nohora@gmail.com>',
      'Luis Garcia <alcarohtar86@gmail.com>',
    ];

    switch (endpoint) {
      case RAGEndpoints.Ecopetrol_Affinity:
        needsPastData = true;
        subject = 'Oceana - Reporte Ecopetrol Afinidad';
        reportName = 'Ecopetrol Afinidad';
        to.push('Mateo Sabogal <mateo.sabogal@ecopetrol.com.co>');
        to.push('Miguel Acosta <miguelan.acosta@ecopetrol.com.co>');
        break;
      case RAGEndpoints.Ecopetrol_Materiality:
        needsPastData = true;
        subject = 'Oceana - Reporte Ecopetrol Materialidad';
        reportName = 'Ecopetrol Materialidad';
        to.push('Mateo Sabogal <mateo.sabogal@ecopetrol.com.co>');
        to.push('Miguel Acosta <miguelan.acosta@ecopetrol.com.co>');
        break;
      case RAGEndpoints.Pairs_Affinity:
        needsPastData = true;
        subject = 'Oceana - Reporte Pares Afinidad';
        reportName = 'Pares Afinidad';
        to.push('Mateo Sabogal <mateo.sabogal@ecopetrol.com.co>');
        to.push('Miguel Acosta <miguelan.acosta@ecopetrol.com.co>');
        break;
      case RAGEndpoints.Pairs_Ranking:
        subject = 'Oceana - Reporte Pares Ranking';
        reportName = 'Pares Ranking';
        to.push('Mateo Sabogal <mateo.sabogal@ecopetrol.com.co>');
        to.push('Miguel Acosta <miguelan.acosta@ecopetrol.com.co>');
        break;
      case RAGEndpoints.Trends_Human_Rights:
        needsPastData = true;
        subject = 'Oceana - Reporte Trends Derechos Humanos';
        reportName = 'Trends Derechos Humanos';
        to.push('Mateo Sabogal <mateo.sabogal@ecopetrol.com.co>');
        to.push('Miguel Acosta <miguelan.acosta@ecopetrol.com.co>');
        break;
      case RAGEndpoints.Trends_Peace:
        subject = 'Oceana - Reporte Trends Paz';
        reportName = 'Trends Paz';
        to.push('Mateo Sabogal <mateo.sabogal@ecopetrol.com.co>');
        to.push('Miguel Acosta <miguelan.acosta@ecopetrol.com.co>');
        break;
      case RAGEndpoints.VTT_News:
        subject = 'Oceana - Reporte VTT Gestión Noticias';
        reportName = 'VTT Gestión Noticias';
        to.push('Rafael Ibarra <rafael.ibarra@ecopetrol.com.co>');
        to.push('Argemiro Quitian <argemiro.quitian@ecopetrol.com.co>');
        break;
      case RAGEndpoints.VTT_Demands:
        reportName = 'VTT Gestión Demandas';
        subject = 'Oceana - Reporte VTT Gestión Demandas';
        to.push('Rafael Ibarra <rafael.ibarra@ecopetrol.com.co>');
        to.push('Argemiro Quitian <argemiro.quitian@ecopetrol.com.co>');
        break;
      case RAGEndpoints.VTT_Daily:
        to.push('Rafael Ibarra <rafael.ibarra@ecopetrol.com.co>');
        to.push('Argemiro Quitian <argemiro.quitian@ecopetrol.com.co>');
        break;
    }

    const reportData: any = await this.createReport(
      {
        endpoint,
        needsPastData,
      },
      token,
    );

    const buffer: Buffer = Buffer.isBuffer(reportData.buffer)
      ? reportData.buffer
      : Buffer.from(reportData.buffer);

    const data = await mg.messages.create('whaleandjaguar.co', {
      from: 'Whale & Jaguar <postmaster@whaleandjaguar.co>',
      to,
      subject,
      text: `Buenos días,\n\nRecibe este Reporte ${reportName} generado por el Observatorio Corporativo de Ecopetrol. Este reporte consolida los principales hallazgos y tendencias monitoreadas en medios, redes sociales y fuentes institucionales, con base en los datos recolectados.\n\nPuedes consultar los detalles y visualizar los indicadores interactivos directamente en la plataforma OCEANA, desde el tablero correspondiente.\n\nSi tienes dudas sobre la lectura del informe o deseas realizar un análisis más específico, puedes apoyarte en el chatbot del Observatorio, formulando preguntas relacionadas con los datos correspondientes.\n\n¡Esperamos que este reporte sea de mucha utilidad!\n\nAtentamente,\nObservatorio Corporativo\nEcopetrol S.A.`,
      attachment: [
        {
          data: buffer,
          filename: reportData.filename,
          contentType: reportData.mimeType,
        },
      ],
    });

    if (!data.id) {
      throw new Error('Failed to send email');
    }
  }
}
