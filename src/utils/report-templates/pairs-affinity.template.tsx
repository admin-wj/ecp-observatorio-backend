import { FC } from 'react';

import HeaderTemplate from './header.template';
import { LineChartWidget, ProgressBar } from '../report-widgets';
import {
  PairsAffinityByPairs,
  PairsAffinityReport,
  PairsAffinityResponse,
} from '../types';
import { getFormattedDate } from '../functions';

interface PairsAffinityTemplateProps {
  data: PairsAffinityResponse;
  pastData: PairsAffinityResponse;
  reportData: PairsAffinityReport;
}

const findMinMaxAffinities = (pairs: PairsAffinityByPairs[]) =>
  pairs.reduce(
    (acc, el) => {
      if (el.peer === 'Ecopetrol') acc.ecopetrol = el;
      else {
        if (acc.max.affinity < el.affinity) acc.max = el;
        if (acc.min.affinity > el.affinity) acc.min = el;
      }

      return acc;
    },
    {
      ecopetrol: {
        id: '',
        affinity: 0,
        dimension: [],
        peer: '',
        total: 0,
      },
      max: {
        id: '',
        affinity: 0,
        dimension: [],
        peer: '',
        total: 0,
      },
      min: {
        id: '',
        affinity: 0,
        dimension: [],
        peer: '',
        total: 0,
      },
    } as Record<string, Omit<PairsAffinityByPairs, 'summary'>>,
  );

const PairsAffinityTemplate: FC<PairsAffinityTemplateProps> = ({
  data,
  pastData,
  reportData,
}) => {
  const {
    dataByPairs,
    dataByPairsAndDimension,
    dataInTimeByAffinity,
    fullQuery,
    count,
  } = data;
  const { peer_summary, peer_dimension, time_analysis } = reportData;

  const startDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$gte),
  );
  const endDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$lte),
  );

  const affByPairs = findMinMaxAffinities(dataByPairs);
  const affByPairDiff = Object.keys(affByPairs).map((key) => {
    const affByPairPast = pastData.dataByPairs.find(
      (d) => affByPairs[key].peer === d.peer,
    );

    const value = affByPairs[key].affinity;
    const pastValue = affByPairPast?.affinity ?? 0;
    const valueDiff = value - pastValue;

    return {
      label: affByPairs[key].peer,
      value: Number((value * 100).toFixed(0)),
      diff: Number((valueDiff * 100).toFixed(0)),
    };
  });

  const pairsAffinityByGroupsColumns = (data: Record<string, any>[]) => {
    const columns =
      data && data.length
        ? Object.keys(data[0]).map((value) =>
            value === 'id'
              ? {
                  field: value,
                  headerName: 'Empresa par',
                }
              : {
                  field: value,
                  headerName: value,
                },
          )
        : [];

    const lastColumn = columns.pop();
    if (lastColumn) columns.splice(1, 0, lastColumn);

    return columns;
  };
  const columns = pairsAffinityByGroupsColumns(dataByPairsAndDimension);

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>
          Reporte sobre la afinidad a la gestión sostenible de pares sectoriales
        </h2>
        <p>
          Este reporte presenta un análisis comparativo de afinidad temática
          entre Ecopetrol y un conjunto de pares sectoriales, con base en
          información recolectada entre el <b>{startDate}</b> y el{' '}
          <b>{endDate}</b>, a partir de medios digitales, redes sociales y otras
          fuentes públicas relevantes. Se analizaron <b>{count}</b> textos en
          total. El objetivo es identificar cómo se relacionan temática y
          discursivamente las empresas del sector en torno a las cuatro
          dimensiones de la gestión sostenible {'('}ambiental, social,
          gobernanza y económica{')'}, lo cual permite evaluar similitudes,
          diferencias y posicionamientos relativos entre los actores analizados.
        </p>
        <br />
        <h3>
          Ecopetrol frente a sus pares sectoriales con mejor y peor índice de
          afinidad y resumen general
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'whitesmoke',
            padding: 8,
          }}
        >
          {affByPairDiff.map(({ label, value, diff }) => (
            <div key={label} style={{ width: '100%', padding: 16 }}>
              <p>
                <b
                  style={{
                    fontSize: 24,
                    color:
                      value > 66
                        ? '#C4D600'
                        : value > 33
                          ? '#FDD100'
                          : '#C85412',
                  }}
                >
                  {value} %
                </b>
                <br />
                <h4>{label}</h4>
                <br />
                <b
                  style={{
                    color: diff >= 0 ? '#C4D600' : '#C85412',
                  }}
                >
                  {diff >= 0 ? '▲' : '▼'} {diff} %
                </b>
              </p>
            </div>
          ))}
        </div>
        <div style={{ width: '100%', padding: 16 }}>
          {peer_summary?.split('\n').map((summary, i) => (
            <p key={`summary-${i}`}>
              {summary}
              <br />
            </p>
          ))}
        </div>
        <br />
        <h3>
          Afinidad y temas críticos por par sectorial y dimensión de la gestión
          sostenible
        </h3>
        <p>
          Esta sección muestra los niveles de afinidad temática para cada par
          sectorial en relación con las cuatro dimensiones de la gestión
          sostenible. La afinidad representa el grado de polaridad discursiva
          entre la empresa y los temas de interés en el entorno digital. Además,
          se presenta un resumen de los temas críticos más relevantes
          identificados durante el periodo, lo que permite visualizar los focos
          de atención pública y diferenciar las prioridades comunicacionales o
          reputacionales entre las distintas compañías del sector.
        </p>
        {dataByPairsAndDimension.map((d, i) => (
          <div
            key={`${d.id}-${i}`}
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
                    const value = d[column.field];
                    return (
                      <td
                        key={column.field}
                        style={{
                          width: column.field === 'id' ? '10%' : '18%',
                          padding: 8,
                          border: '1px solid #ccc',
                        }}
                      >
                        {column.field !== 'id' && value
                          ? ProgressBar(value as number)
                          : (value as string | number)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            {peer_dimension
              ? peer_dimension[
                  d.id === 'General' ? 'general' : (d.id as string)
                ][0]
                  ?.split('\n')
                  .map((pairDim, i) => (
                    <p key={`pair-dimension-${i}`}>
                      {pairDim}
                      <br />
                    </p>
                  ))
              : ''}
          </div>
        ))}
        <br />
        <h3>Afinidad en el tiempo por par sectorial</h3>
        <p>
          En esta sección se analiza la evolución temporal de la afinidad
          temática por par sectorial, lo que permite observar variaciones en la
          afinidad alrededor de los temas sostenibles a lo largo del tiempo.
          Esta perspectiva facilita la identificación de momentos clave, picos
          de atención o cambios en el enfoque de cada empresa del sector en
          relación con las dimensiones ambiental, social, de gobernanza y
          económica. Esta información resulta útil para comprender dinámicas
          reputacionales, anticipar riesgos y ajustar estrategias de
          comunicación o posicionamiento.
        </p>
        {dataInTimeByAffinity.length &&
          Object.keys(dataInTimeByAffinity[0]).map((key) =>
            key === 'x' ? null : (
              <div key={key} style={{ marginTop: 32 }}>
                <LineChartWidget
                  id={key}
                  data={dataInTimeByAffinity}
                  xlabel="Fecha"
                  ylabel="Afinidad (%)"
                />
                <div style={{ marginTop: 16 }}></div>
                {time_analysis &&
                  time_analysis[key] &&
                  time_analysis[key].length &&
                  time_analysis[key][0]?.split('\n').map((ta, i) => (
                    <p key={`time-analysis-${i}`}>
                      {ta}
                      <br />
                    </p>
                  ))}
              </div>
            ),
          )}
      </div>
    </>
  );
};

export default PairsAffinityTemplate;
