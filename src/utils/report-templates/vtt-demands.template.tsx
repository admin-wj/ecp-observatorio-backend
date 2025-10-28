import dayjs from 'dayjs';
import { FC } from 'react';

import HeaderTemplate from './header.template';
import { Polarity } from '../enums';
import { ActorSummary, VTTDemandsReport, VTTDemandsResponse } from '../types';

interface VTTDemandsTemplateProps {
  data: VTTDemandsResponse;
  reportData: VTTDemandsReport;
}

const VTTDemandsTemplate: FC<VTTDemandsTemplateProps> = ({
  data,
  reportData,
}) => {
  const { dataByCity, dataByActor, fullQuery, count } = data;
  const { location, claim_actor } = reportData;

  const startDate = dayjs(new Date((fullQuery?.timestamp as any)?.$gte)).format(
    'DD/MM/YYYY',
  );
  const endDate = dayjs(new Date((fullQuery?.timestamp as any)?.$lte)).format(
    'DD/MM/YYYY',
  );

  const newData = dataByActor.map((d) => ({
    ...d,
    keywords:
      claim_actor && claim_actor[d.claim_actor]
        ? claim_actor[d.claim_actor].keywords
        : [''],
  }));

  const columns = [
    {
      field: 'actor',
      headerName: 'Actor',
    },
    {
      field: 'keywords',
      headerName: 'Palabras clave',
    },
    {
      field: 'affinity',
      headerName: 'Sentimiento',
    },
    {
      field: 'total',
      headerName: 'Volumen',
    },
  ];

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>Reporte de gestión de conocimiento | Demandas</h2>
        <p>
          Este reporte automatizado permite identificar y analizar demandas o
          expresiones de insatisfacción de los grupos de interés, con base en el
          monitoreo de medios de comunicación local, nacional e internacional,
          redes sociales, entre otras fuentes . Cubre el periodo comprendido
          entre <b>{startDate}</b> y <b>{endDate}</b>, con un total de{' '}
          <b>{count}</b> textos analizados. La información ha sido organizada
          para facilitar la lectura de tendencias por territorio y por tipo de
          actor involucrado, permitiendo una visión estratégica de los focos de
          tensión.
        </p>
        <h3>Temas más relevantes por territorio</h3>
        <p>
          Esta sección presenta un resumen de los temas clave identificados en
          cada departamento, permitiendo entender las particularidades
          territoriales de las demandas. Los resultados se agrupan por ubicación
          geográfica para facilitar el análisis diferenciado según las dinámicas
          locales.
        </p>
        {dataByCity.map((row, rowIndex) => (
          <div key={`${row.name}-${rowIndex}`}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Ubicación
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Volumen
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {row.value}
                  </td>
                </tr>
              </tbody>
            </table>
            {location[row.name]}
          </div>
        ))}
        <br />
        <h3>Resumen de demandas por actor</h3>
        <p>
          En esta sección se presentan los temas más relevantes agrupados según
          el tipo de actor que los expresa o protagoniza. Las categorías
          incluyen actores Políticos, Agros, Étnicos y otros definidos por la
          VTT, permitiendo detectar patrones de movilización o insatisfacción
          por perfil social.
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
                    const value: any = d[column.field as keyof ActorSummary];
                    if (column.field === 'affinity') {
                      const { Positivo, Neutro, Negativo } = value as {
                        [Polarity.Negative]: number;
                        [Polarity.Neutral]: number;
                        [Polarity.Positive]: number;
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
                              Positivo: {((Positivo / count) * 100).toFixed(0)}{' '}
                              %
                            </div>
                            <div
                              style={{
                                padding: 16,
                                backgroundColor: '#FDD100',
                              }}
                            >
                              Neutro: {((Neutro / count) * 100).toFixed(0)} %
                            </div>
                            <div
                              style={{
                                padding: 16,
                                backgroundColor: '#C85412',
                                color: '#FFFFFF',
                              }}
                            >
                              Negativo: {((Negativo / count) * 100).toFixed(0)}{' '}
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
            {claim_actor &&
            claim_actor[d.claim_actor] &&
            claim_actor[d.claim_actor]?.summary?.length
              ? claim_actor[d.claim_actor]?.summary[0]
                  ?.split('\n')
                  .map((summary, i) => (
                    <p key={`summary-claim-actor-${i}`}>
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

export default VTTDemandsTemplate;
