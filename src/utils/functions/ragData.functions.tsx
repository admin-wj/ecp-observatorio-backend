import { FC } from 'react';
import { FilterQuery } from 'mongoose';
import { Writable } from 'stream';

import { RAGEndpoints } from '../enums';
import EcopetrolAffinityTemplate from '../report-templates/ecopetrol-affinity.template';
import EcopetrolMaterialityTemplate from '../report-templates/ecopetrol-materiality.template';
import PairsAffinityTemplate from '../report-templates/pairs-affinity.template';
import PairsRankingTemplate from '../report-templates/pairs-ranking.template';
import TrendsHumanRightsTemplate from '../report-templates/trends-human-rights.template';
import TrendsPeaceTemplate from '../report-templates/trends-peace.template';
import VTTNewsTemplate from '../report-templates/vtt-news.template';
import VTTDemandsTemplate from '../report-templates/vtt-demands.template';
import VTTDailyTemplate from '../report-templates/vtt-daily.template';
import { FiltersValues } from '../types';

export const ragAPICall = async (
  ragEndpoint: 'generate-summary' | 'generate-report',
  query: FilterQuery<unknown>,
  endpoint: RAGEndpoints,
  data?: Record<string, unknown>,
) => {
  const ragApiUrl = process.env.RAG_API_URL ?? '';

  try {
    const response = await fetch(`${ragApiUrl}/${ragEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        endpoint,
        data,
      }),
    });

    if (!response.ok) throw new Error('Error fetching RAG data');
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getHTMLComponent = async (
  endpoint: RAGEndpoints,
  data: Record<string, unknown>,
  reportData: Record<string, unknown>,
  pastData?: Record<string, unknown>,
  filterValues?: FiltersValues,
) => {
  const { renderToPipeableStream } = require('react-dom/server');

  const componentToString = async (
    Component: FC<Record<string, any>>,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      let html = '';

      const writableStream = new Writable({
        write(chunk, _, callback) {
          html += chunk.toString();
          callback();
        },
      });

      const { pipe } = renderToPipeableStream(
        <Component
          data={data}
          pastData={pastData}
          reportData={reportData}
          filterValues={filterValues}
        />,
        {
          onShellReady() {
            pipe(writableStream);
          },
          onAllReady() {
            resolve(html);
          },
          onError(error: Error) {
            reject(error);
          },
        },
      );
    });
  };

  let htmlString = '';

  switch (endpoint) {
    case RAGEndpoints.Ecopetrol_Affinity:
      htmlString = await componentToString(EcopetrolAffinityTemplate);
      break;
    case RAGEndpoints.Ecopetrol_Materiality:
      htmlString = await componentToString(EcopetrolMaterialityTemplate);
      break;
    case RAGEndpoints.Pairs_Affinity:
      htmlString = await componentToString(PairsAffinityTemplate);
      break;
    case RAGEndpoints.Pairs_Ranking:
      htmlString = await componentToString(PairsRankingTemplate);
      break;
    case RAGEndpoints.Trends_Human_Rights:
      htmlString = await componentToString(TrendsHumanRightsTemplate);
      break;
    case RAGEndpoints.Trends_Peace:
      htmlString = await componentToString(TrendsPeaceTemplate);
      break;
    case RAGEndpoints.VTT_News:
      htmlString = await componentToString(VTTNewsTemplate);
      break;
    case RAGEndpoints.VTT_Demands:
      htmlString = await componentToString(VTTDemandsTemplate);
      break;
    case RAGEndpoints.VTT_Daily:
      htmlString = await componentToString(VTTDailyTemplate);
      break;
  }

  return htmlString;
};
