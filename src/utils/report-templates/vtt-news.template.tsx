import dayjs from 'dayjs';
import { FC } from 'react';

import HeaderTemplate from './header.template';
import { Relevance } from '../enums';
import { ComponentSummary, VTTNewsReport, VTTNewsResponse } from '../types';

interface VTTNewsTemplateProps {
  data: VTTNewsResponse;
  reportData: VTTNewsReport;
}

const VTTNewsTemplate: FC<VTTNewsTemplateProps> = ({ data, reportData }) => {
  const { dataByComp, fullQuery, count } = data;
  const { components } = reportData;

  const startDate = dayjs(new Date((fullQuery?.timestamp as any)?.$gte)).format(
    'DD/MM/YYYY',
  );
  const endDate = dayjs(new Date((fullQuery?.timestamp as any)?.$lte)).format(
    'DD/MM/YYYY',
  );

  const newData = dataByComp.map((d) => ({
    ...d,
    keywords:
      components && components[d.component]
        ? components[d.component].keywords
        : [''],
  }));

  const columns = [
    {
      field: 'component',
      headerName: 'Componente',
    },
    {
      field: 'keywords',
      headerName: 'Palabras clave',
    },
    {
      field: 'relevance',
      headerName: 'Relevancia',
    },
    {
      field: 'count',
      headerName: 'Volumen',
    },
  ];

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>Reporte de gestión de conocimiento | Noticias</h2>
        <p>
          Este reporte presenta un análisis automatizado de noticias relevantes
          para la gestión del conocimiento en Ecopetrol, con foco en los
          componentes estratégicos definidos por el equipo VTT. El análisis
          cubre el periodo entre <b>{startDate}</b> y <b>{endDate}</b>, e
          incluye un total de <b>{count}</b> textos. Las noticias han sido
          clasificadas por componente de interés, mostrando el volumen de
          textos, el sentimiento predominante y las palabras clave más
          relevantes. También se incluye un resumen con los temas predominantes
          identificados por componente durante el periodo.
        </p>
        {newData.map((d, i) => (
          <div
            key={`comp-${i}`}
            style={{
              paddingBottom: 32,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
                  {columns.map((column) => (
                    <th
                      key={column.field}
                      style={{
                        padding: 8,
                        textAlign: 'left',
                      }}
                    >
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr key={i}>
                  {columns.map((column) => {
                    const value = d[column.field as keyof ComponentSummary];
                    if (column.field === 'relevance') {
                      const relevanceData = value as {
                        [Relevance.Low]: number;
                        [Relevance.Medium]: number;
                        [Relevance.High]: number;
                      };
                      const { count } = d;

                      return (
                        <td
                          key={column.field}
                          style={{
                            width: '25%',
                            padding: 8,
                            border: '1px solid #ccc',
                          }}
                        >
                          <div
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            <div
                              style={{
                                padding: 16,
                                backgroundColor: '#C4D600',
                              }}
                            >
                              {Relevance.Low}:{' '}
                              {(
                                ((relevanceData?.[Relevance.Low] || 0) /
                                  count) *
                                100
                              ).toFixed(0)}{' '}
                              %
                            </div>
                            <div
                              style={{
                                padding: 16,
                                backgroundColor: '#FDD100',
                              }}
                            >
                              {Relevance.Medium}:{' '}
                              {(
                                ((relevanceData?.[Relevance.Medium] || 0) /
                                  count) *
                                100
                              ).toFixed(0)}{' '}
                              %
                            </div>
                            <div
                              style={{
                                padding: 16,
                                backgroundColor: '#C85412',
                                color: '#FFFFFF',
                              }}
                            >
                              {Relevance.High}:{' '}
                              {(
                                ((relevanceData?.[Relevance.High] || 0) /
                                  count) *
                                100
                              ).toFixed(0)}{' '}
                              %
                            </div>
                          </div>
                        </td>
                      );
                    } else if (column.field === 'keywords')
                      return (
                        <td
                          key={column.field}
                          style={{
                            width: '25%',
                            padding: 8,
                            border: '1px solid #ccc',
                          }}
                        >
                          {(value as string[]).join(', ')}
                        </td>
                      );
                    else
                      return (
                        <td
                          key={column.field}
                          style={{
                            width: '25%',
                            padding: 8,
                            border: '1px solid #ccc',
                          }}
                        >
                          {value as string | number}
                        </td>
                      );
                  })}
                </tr>
              </tbody>
            </table>
            {components &&
            components[d.component] &&
            components[d.component]?.summary?.length
              ? components[d.component]?.summary[0]
                  ?.split('\n')
                  .map((summary, i) => (
                    <p key={`summary-component-${i}`}>
                      {summary}
                      <br />
                    </p>
                  ))
              : ''}
          </div>
        ))}
      </div>
    </>
  );
};

export default VTTNewsTemplate;
