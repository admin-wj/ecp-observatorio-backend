import { FC } from 'react';

import HeaderTemplate from './header.template';
import { LineChartWidget, ProgressBar } from '../pdf-widgets';
import { EcopetrolAffinityReport, EcopetrolAffinityResponse } from '../types';
import { getFormattedDate } from '../functions';

interface EcopetrolAffinityTemplateProps {
  data: EcopetrolAffinityResponse;
  pastData: EcopetrolAffinityResponse;
  reportData: EcopetrolAffinityReport;
}

const EcopetrolAffinityTemplate: FC<EcopetrolAffinityTemplateProps> = ({
  data,
  pastData,
  reportData,
}) => {
  const { dataByGroup, dataByCity, dataInTimeByDimension, fullQuery, count } =
    data;
  const { dimension_summary, ginterest_dimension, geographic, time_analysis } =
    reportData;

  const startDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$gte),
  );
  const endDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$lte),
  );

  const affByDim = dataByGroup.find((d) => d.id === 'General');
  const affByDimPast = pastData.dataByGroup.find((d) => d.id === 'General');
  const affByDimDiff: {
    label: string;
    value: number;
    diff: number;
  }[] = [];
  if (affByDim) {
    Object.keys(affByDim).forEach((key) => {
      if (key !== 'id')
        affByDimDiff.push({
          label: key,
          value: Number(((affByDim[key] as number) * 100).toFixed(0)),
          diff: Number(
            (
              ((affByDim[key] as number) -
                (affByDimPast && affByDimPast[key]
                  ? (affByDimPast[key] as number)
                  : 0)) *
              100
            ).toFixed(0),
          ),
        });
    });
    const lastAffByDimDiff = affByDimDiff.pop();
    if (lastAffByDimDiff) affByDimDiff.splice(0, 0, lastAffByDimDiff);
  }

  const ecopetrolAffinityByGroupColumns = (data: Record<string, any>[]) => {
    const columns =
      data && data.length
        ? Object.keys(data[0]).map((key) =>
            key === 'id'
              ? {
                  field: key,
                  headerName: 'Grupo de interés',
                }
              : {
                  field: key,
                  headerName: key,
                },
          )
        : [];

    const lastColumn = columns.pop();
    if (lastColumn) columns.splice(1, 0, lastColumn);

    return columns;
  };
  const columns = ecopetrolAffinityByGroupColumns(dataByGroup);

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>Reporte sobre la afinidad a la gestión sostenible de Ecopetrol</h2>
        <p>
          Este reporte presenta un análisis de afinidad temática con relación a
          Ecopetrol, utilizando datos recolectados entre el <b>{startDate}</b> y
          el <b>{endDate}</b> a partir de medios digitales, redes sociales y
          otras fuentes públicas relevantes, así como de fuentes internas de la
          Oficina de Participación Ciudadan. En esta ocasión se están analizando
          un total de <b>{count}</b> textos. El objetivo es identificar los
          temas más asociados a la compañía, clasificados por grupo de interés y
          dimensión de la gestión sostenible. Este análisis permite conocer el
          posicionamiento temático de Ecopetrol en el entorno digital,
          identificar oportunidades o alertas reputacionales, y ofrecer insumos
          para una gestión estratégica más informada.
        </p>
        <br />
        <h3>Indicador de afinidad a la gestión sostenible y resumen general</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'whitesmoke',
            padding: 8,
          }}
        >
          <div style={{ width: '100%', padding: 16 }}>
            {affByDimDiff.map(({ label, value, diff }) => (
              <div
                key={label}
                style={{ border: '1px solid gray', padding: 16 }}
              >
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
            {dimension_summary?.split('\n').map((summary, i) => (
              <p key={`summary-${i}`}>
                {summary}
                <br />
              </p>
            ))}
          </div>
        </div>
        <br />
        <h3>
          Afinidad y temas críticos por grupo de interés y dimensión de la
          gestión sostenible
        </h3>
        <p>
          En esta sección se presentan los niveles de afinidad temática entre
          Ecopetrol y cada dimensión de la gestión sostenible, discriminados por
          grupo de interés. La afinidad combina la polaridad y relevancia con
          que cada tema aparece vinculado a la compañía. Adicionalmente, se
          identifican los principales temas críticos observados durante el
          periodo analizado, tanto de forma general como por grupo de interés.
          Esta información permite priorizar acciones de relacionamiento,
          identificar preocupaciones emergentes y enfocar esfuerzos
          comunicacionales o de gestión.
        </p>
        {dataByGroup.map((d, i) => (
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
                        {column.field !== 'id' &&
                        column.field !== 'summary' &&
                        value
                          ? ProgressBar(value as number)
                          : (value as string | number)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            {ginterest_dimension
              ? ginterest_dimension[
                  d.id === 'General' ? 'general' : (d.id as string)
                ][0]
                  ?.split('\n')
                  .map((giDim, i) => (
                    <p key={`group-interest-dimension-${i}`}>
                      {giDim}
                      <br />
                    </p>
                  ))
              : ''}
          </div>
        ))}
        <br />
        <h3>
          Afinidad según ubicación y en el tiempo, por grupo de interés y por
          dimensión de la gestión sostenible
        </h3>
        <p>
          Esta sección complementa el análisis anterior mostrando, en primer
          lugar, la afinidad temática por ubicación geográfica {'('}departamento
          {')'}, lo que permite identificar regiones con mayor presencia o
          sensibilidad frente a los temas tratados. En segundo lugar, se
          incluyen gráficas de evolución temporal de la afinidad para cada
          dimensión de la gestión sostenible, lo que facilita el seguimiento de
          tendencias, picos de atención o cambios en el discurso digital a lo
          largo del tiempo. Esta perspectiva territorial y temporal apoya la
          anticipación de riesgos, la evaluación de impactos regionales y la
          planificación de intervenciones focalizadas.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Ubicación</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Afinidad</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Volumen</th>
            </tr>
          </thead>
          <tbody>
            {dataByCity.map((row, rowIndex) => (
              <tr key={`${row.name}-${rowIndex}`}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {row.name}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {ProgressBar(Number((row.value / row.count).toFixed(2)))}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {row.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        {geographic?.split('\n').map((g, i) => (
          <p key={`geographic-${i}`}>
            {g}
            <br />
          </p>
        ))}
        {dataInTimeByDimension.length &&
          Object.keys(dataInTimeByDimension[0]).map((key) =>
            key === 'x' ? null : (
              <div key={key} style={{ marginTop: 32 }}>
                <LineChartWidget
                  id={key}
                  data={dataInTimeByDimension}
                  xlabel="Fecha"
                  ylabel="Afinidad (%)"
                />
                <div style={{ marginTop: 16 }}></div>
                {time_analysis
                  ? time_analysis[key][0]?.split('\n').map((ta, i) => (
                      <p key={`time-analysis-${i}`}>
                        {ta}
                        <br />
                      </p>
                    ))
                  : ''}
              </div>
            ),
          )}
      </div>
    </>
  );
};

export default EcopetrolAffinityTemplate;
