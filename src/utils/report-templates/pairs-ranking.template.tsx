import * as dayjs from 'dayjs';
import { FC } from 'react';

import HeaderTemplate from './header.template';
import { getYear } from '../functions';
import { ProgressBar } from '../pdf-widgets';
import {
  FiltersValues,
  PairsRankingReport,
  PairsRankingResponse,
} from '../types';

interface PairsRankingTemplateProps {
  data: PairsRankingResponse;
  reportData: PairsRankingReport;
  filterValues?: FiltersValues;
}

const PairsRankingTemplate: FC<PairsRankingTemplateProps> = ({
  data,
  reportData,
  filterValues,
}) => {
  const { dataByRanking, fullQuery, rawData } = data;

  const startDate = dayjs(new Date((fullQuery?.timestamp as any)?.$gte)).format(
    'DD/MM/YYYY',
  );
  const endDate = dayjs(new Date((fullQuery?.timestamp as any)?.$lte)).format(
    'DD/MM/YYYY',
  );

  const pairsRankingList = [
    'Ecopetrol',
    'Braskem S/A',
    'Chevron Corporation',
    'Galp Energia SA',
    'GeoPark',
    'Hess Corporation',
    'Inpex Corporation',
    'Petróleo Brasileiro SA (Petrobras)',
    'Woodside',
  ];

  const getImportantOrgsColumns = (orgList: string[]) => {
    return orgList.map((org) => ({
      field: org,
      headerName: org,
    }));
  };

  const pairsRankingByOrgColumns = () => {
    const pairs = filterValues?.peer?.length
      ? filterValues.peer.map((pair) => ({
          field: pair,
          headerName: pair,
        }))
      : getImportantOrgsColumns(pairsRankingList);

    return [
      { field: 'ranking_org', headerName: 'Evaluadora' },
      { field: 'ranking_name', headerName: 'Ranking' },
      { field: 'year', headerName: 'Year' },
      ...pairs,
    ];
  };

  const columns = pairsRankingByOrgColumns();

  const pairsRankingColumns = [
    {
      field: 'timestamp',
      headerName: 'Fecha',
    },
    {
      field: 'peer',
      headerName: 'Empresa Par',
    },
    {
      field: 'ranking_org',
      headerName: 'Evaluadora',
    },
    {
      field: 'ranking_name',
      headerName: 'Nombre de Ranking',
    },
    {
      field: 'rank',
      headerName: 'Ranking',
    },
    {
      field: 'score_raw',
      headerName: 'Calificación',
    },
    {
      field: 'score_100',
      headerName: 'Calificación / 100',
    },
  ];

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>
          Reporte sobre Ecopetrol y sus pares sectoriales de acuerdo con el
          ranking ESG
        </h2>
        <p>
          Este reporte presenta un análisis comparativo de los resultados
          obtenidos por Ecopetrol y sus pares sectoriales en diversos rankings
          ESG {'('}ambientales, sociales y de gobernanza{')'} de relevancia
          estratégica, con información recolectada entre el <b>{startDate}</b> y
          el <b>{endDate}</b>. El objetivo es evaluar el posicionamiento
          relativo de Ecopetrol en materia de sostenibilidad, identificando
          fortalezas, brechas y tendencias frente a otras empresas del sector
          energético, tanto a nivel nacional como internacional. La
          sistematización de estos resultados permite orientar la toma de
          decisiones para el mejoramiento continuo en desempeño ESG y la
          alineación con estándares globales de sostenibilidad.
        </p>
        <br />
        <p>{reportData.ranking_summary}</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
              {columns.map((column) => (
                <th
                  key={column.field}
                  style={{ padding: '10px', textAlign: 'left' }}
                >
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataByRanking.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => {
                  const value = row[column.field];
                  return (
                    <td
                      key={column.field}
                      style={{ padding: '10px', border: '1px solid #ccc' }}
                    >
                      {pairsRankingList.includes(column.field) && value
                        ? ProgressBar(value as number)
                        : (value as string | number)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
              {pairsRankingColumns.map((column) => (
                <th
                  key={column.field}
                  style={{ padding: '10px', textAlign: 'left' }}
                >
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rawData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {pairsRankingColumns.map((column) => {
                  const value = (row as any)[column.field];
                  return (
                    <td
                      key={column.field}
                      style={{ padding: '10px', border: '1px solid #ccc' }}
                    >
                      {column.field === 'score_100' && !Number.isNaN(value)
                        ? ProgressBar(value)
                        : column.field === 'timestamp' && value
                          ? getYear(value)
                          : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PairsRankingTemplate;
