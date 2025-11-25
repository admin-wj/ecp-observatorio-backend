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
    const getDataURL = (currentParams: string) =>
      `${process.env.API_URL}${process.env.PORT ? `:${process.env.PORT}` : ''}/api/${endpoint.replaceAll('-', '/')}?${currentParams.toString()}`;

    if (currentData) {
      data = currentData;
    } else {
      const currentParams = new URLSearchParams(getReportDates(endpoint));

      const dataResponse = await fetch(getDataURL(currentParams.toString()), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        cache: 'no-store',
      });

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
      const dataResponse = await fetch(getDataURL(currentParams.toString()), {
        headers: {
          Authorization: token || '',
        },
      });

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
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    } else {
      const buffer = await generatePDF(htmlContent);
      const filename = `${baseFileName}.pdf`;
      return {
        buffer,
        filename,
        mimeType:
          'application/pdf',
      };
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
